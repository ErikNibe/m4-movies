import { QueryResult } from "pg";

interface iMovieRequest {
    name: string;
    description: string;
    duration: number;
    price: number;
};

interface iMovieInfo extends iMovieRequest {
    id: number
};

interface iMovieInfoPage {
    previousPage: string | null,
    nextPage: string | null,
    count: number,
    data: iMovieInfo[]
}

type tMovieResult = QueryResult<iMovieInfo>;

type tCreateMovieRequiredKeys = "name" | "duration" | "price";

type tSortAcceptableKeys = "price" | "duration";

type tOrderAcceptableKeys = "ASC" | "DESC";

export { iMovieRequest, iMovieInfo, iMovieInfoPage, tMovieResult, tCreateMovieRequiredKeys, tSortAcceptableKeys, tOrderAcceptableKeys };