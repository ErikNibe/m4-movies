import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { tMovieResult } from "./interfaces";

const verifyMovieNameExists = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    const { name } = request.body;

    const queryString: string = `
        SELECT
            name
        FROM 
            movies_info
        WHERE
            name = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [name]
    }

    const queryResult: tMovieResult | [] = await client.query(queryConfig);
    
    if (queryResult.rowCount) {
        return response.status(409).json({
            message: "Movie name already exists!"
        })
    }

    return next();
}

const verifyMovieInfoExists = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    
    const id: number = Number(request.params.id);
    
    const queryString: string = `
        SELECT
            *
        FROM
            movies_info
        WHERE
            id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    };

    const queryResult: tMovieResult | [] = await client.query(queryConfig);
    
    if (!queryResult.rowCount) {
        return response.status(404).json({
            message: "Movie not found."
        })
    }   
    
    return next();
}
export { verifyMovieNameExists, verifyMovieInfoExists }