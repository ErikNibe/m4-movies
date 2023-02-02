import { request, Request, Response } from "express";
import { QueryConfig } from "pg";
import format, { config } from "pg-format";
import { client } from "./database";
import { iMovieInfo, iMovieInfoPage, iMovieRequest, tCreateMovieRequiredKeys, tMovieResult, tOrderAcceptableKeys, tSortAcceptableKeys } from "./interfaces";

const createMovie = async (request: Request, response: Response): Promise<Response> => {

    const movieDataRequest: iMovieRequest = request.body;

    const queryString: string = format(
        `
            INSERT INTO	
                movies_info(%I)
            VALUES
                (%L)
            RETURNING *;
        `,
        Object.keys(movieDataRequest),
        Object.values(movieDataRequest)
    );

    const queryResult: tMovieResult = await client.query(queryString);
    const newMovieInfo:iMovieInfo = queryResult.rows[0];
   
    return response.status(201).json(newMovieInfo);
};

const listMovies = async (request: Request, response: Response): Promise<Response> => {

    const perPage: any = request.query.perPage === undefined || Number(request.query.perPage) <= 0 || Number(request.query.perPage) > 5 ? 5 : request.query.perPage;
    let page: any = request.query.page === undefined || Number(request.query.page) <= 0 ? 1 : request.query.page;

    const sort: any = request.query.sort;
    const order: any = request.query.sort === undefined ? undefined : request.query.order === undefined ? "ASC" : request.query.order;

    const sortAcceptableKeys: tSortAcceptableKeys[] = ["price", "duration"];
    const orderAcceptableKeys: tOrderAcceptableKeys[] = ["ASC", "DESC"];

    const sortIsRequiredKey: boolean = sortAcceptableKeys.includes(sort);
    const orderIsRequiredKey: boolean = order && orderAcceptableKeys.includes(order.toUpperCase());
    
    let queryString: string = `
        SELECT 
            *
        FROM 
            movies_info
        LIMIT $1 OFFSET $2;
    `;

    let queryConfig: QueryConfig = {
        text: queryString,
        values: [perPage, (page - 1) * perPage]
    };

    if (sortIsRequiredKey && orderIsRequiredKey) {

        if (order === "ASC") {
            
            queryString = format(
                `
                    SELECT 
                        *
                    FROM 
                        movies_info
                    ORDER BY
                        %s ASC
                    LIMIT $1 OFFSET $2;
                `,
                sort
            );
        }

        else {
            
            queryString = format(`
                SELECT 
                    *
                FROM 
                    movies_info
                ORDER BY
                    %s DESC
                LIMIT $1 OFFSET $2;
            `,
                sort
            );
        };

        queryConfig = {
            text: queryString,
            values: [perPage, (page - 1) * perPage]
        };
    }
    
    const queryResult: tMovieResult = await client.query(queryConfig);
    
    const baseURL: string = "http://localhost:3000/movies";
    let previousPage: string | null = `${baseURL}?page=${Number(page) - 1}&perPage=${perPage}`;
    let nextPage: string | null = `${baseURL}?page=${Number(page) + 1}&perPage=${perPage}`;

    if (Number(page) === 1) {
        previousPage = null;
    };

    if (queryResult.rowCount === 0) {
        nextPage = null;
    };

    const queryStringNextPage: string = `
        SELECT 
            *
        FROM 
            movies_info
        LIMIT $1 OFFSET $2;
    `;

    const queryConfigNextPage: QueryConfig = {
        text: queryStringNextPage,
        values: [perPage, page * perPage]
    };

    const queryResultNextPage: tMovieResult = await client.query(queryConfigNextPage);
    
    if (queryResultNextPage.rowCount === 0) {
        nextPage = null;
    };

    const newResponse: iMovieInfoPage = {
        previousPage,
        nextPage,
        count: queryResult.rowCount,
        data: queryResult.rows
    };

    return response.status(200).json(newResponse);
};

const updateMovie = async (request: Request, response: Response): Promise<Response> => {
    
    if (request.body.id) {
        delete request.body.id;
    }

    const id: number = Number(request.params.id);

    const requestKeys: string[] = Object.keys(request.body);
    const requestValues: string[] = Object.values(request.body);

    const queryString: string = format(
        `
            UPDATE
                movies_info
            SET (%I) = ROW(%L)
            WHERE
                id = $1
            RETURNING *;
        `,
        requestKeys,
        requestValues
    );

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    } 

    const queryResult: tMovieResult = await client.query(queryConfig);

    return response.status(200).json(queryResult.rows[0]);
};

const deleteMovie = async (request: Request, response: Response): Promise<Response> => {
    
    const id: number = Number(request.params.id);

    const queryString: string = `
        DELETE FROM
            movies_info
        WHERE
            id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    };

    await client.query(queryConfig);
    
    return response.status(204).send();
}

export { createMovie, listMovies, updateMovie, deleteMovie };