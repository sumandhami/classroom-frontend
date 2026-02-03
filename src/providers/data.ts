import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest";
import {BACKEND_BASE_URL} from "@/constants";
import {CreateResponse, ListResponse} from "@/types";
import {GetOneResponse, HttpError} from "@refinedev/core";

if (!BACKEND_BASE_URL) throw new Error("BACKEND_BASE_URL is not configured. Please set VITE_BACKEND_BASE_URL in your .env file.");

const buildHttpError = async (response: Response): Promise<HttpError> => {
    let message = 'Request failed.';

    try {
        const payload = (await response.json()) as {message?: string}

        if(payload?.message) message = payload.message;
    }catch {
        //Ignore errors
    }

    return {
        message,
        statusCode: response.status
    }
}

const options: CreateDataProviderOptions = {
    getList: {
        getEndpoint: ({ resource }) => resource,

        buildQueryParams: async ({resource, pagination, filters}) => {
            const page = pagination?.currentPage ?? 1;
            const pageSize = pagination?.pageSize ?? 10;

            const params: Record<string, string|number> = {page, limit: pageSize};

            filters?.forEach((filter) => {
                const field = 'field' in filter ? filter.field : '';

                const value = String(filter.value);

                if(resource === 'subjects') {
                    if(field === 'departmentId' || field === 'department') params.department = value;
                    if(field === 'name' || field === 'code' || field === 'q') params.search = value;
                }

                if(resource === 'classes') {
                    if(field === 'name' || field === 'q') params.search = value;
                    if(field === 'subjectId' || field === 'subject') params.subject = value;
                    if(field === 'teacherId' || field === 'teacher') params.teacher = value;
                }

                if(resource === 'users') {
                    if(field === 'role') params.role = value;
                    if(field === 'name' || field === 'email' || field === 'q') params.search = value;
                }

                if(resource === 'departments') {
                    if(field === 'name' || field === 'code' || field === 'q') params.search = value;
                }
            })

            return params;
        },

        mapResponse: async (response) => {
            if(!response.ok) throw await buildHttpError(response);

            const payload: ListResponse = await response.clone().json();

            return payload.data ?? [];
        },

        getTotalCount: async (response) => {
            if(!response.ok) throw await buildHttpError(response);

            const payload: ListResponse = await response.clone().json();

            return payload.pagination?.total ?? payload.data?.length ?? 0;
        }
    },

    create: {
        getEndpoint: ({ resource }) => resource,

        buildBodyParams: async ({variables}) => variables,

        mapResponse: async (response) => {
            const json: CreateResponse = await response.json();

            if (!json.data) {
                throw new Error('Resource not found');
            }

            return json.data ;
        }
    },

    update: {
        getEndpoint: ({ resource, id }) => `${resource}/${id}`,
        buildBodyParams: async ({variables}) => variables,
        mapResponse: async (response) => {
            const json = await response.json();
            if (!json.data) throw new Error('Resource not found');
            return json.data;
        }
    },

    deleteOne: {
        getEndpoint: ({ resource, id }) => `${resource}/${id}`,
        mapResponse: async (response) => {
            const json = await response.json();
            if (!response.ok) throw await buildHttpError(response);
            return json.data;
        }
    },

    getOne: {
        getEndpoint: ({ resource, id}) => `${resource}/${id}`,

        mapResponse: async (response) => {
            const json: GetOneResponse = await response.json();

            if (!json.data) {
                throw new Error('Resource not found');
            }

            return json.data;
        }
    }
}

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };