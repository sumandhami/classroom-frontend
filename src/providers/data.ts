import { DataProvider, HttpError } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";
import { CreateResponse, ListResponse, GetOneResponse } from "@/types";
import axios, { AxiosError } from "axios";

if (!BACKEND_BASE_URL) throw new Error("BACKEND_BASE_URL is not configured.");

const axiosInstance = axios.create({
    baseURL: BACKEND_BASE_URL,
    withCredentials: true, 
});

const shouldLogAxios = import.meta.env?.DEV === true;
const scrubUrl = (url?: string) => url?.split("?")[0];

    axiosInstance.interceptors.request.use((config) => {
            if (shouldLogAxios) {
                    console.debug(`[Axios] ${config.method?.toUpperCase()} ${scrubUrl(config.url)}`);
                }
            return config;
        });

axiosInstance.interceptors.response.use(
    (response) => {
        if (shouldLogAxios) {
            console.debug(`[Axios] ✅ ${response.status} from ${scrubUrl(response.config.url)}`);
        }
        return response;
    },
    (error) => {
        if (shouldLogAxios) {
            console.debug(`[Axios] ❌ Error from ${scrubUrl(error.config?.url)}:`, error.response?.status);
        }
        return Promise.reject(error);
    }
);

const buildHttpError = (error: AxiosError): HttpError => {
    const message = (error.response?.data as any)?.message || error.message || 'Request failed';
    return {
        message,
        statusCode: error.response?.status || 500
    };
};

export const dataProvider: DataProvider = {
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
        try {
            const page = pagination?.current ?? 1;
            const pageSize = pagination?.pageSize ?? 10;

            const params: Record<string, string | number> = { page, limit: pageSize };

            if (sorters && sorters.length > 0) {
                params.sortField = sorters[0].field;
                params.sortOrder = sorters[0].order;
            }

            filters?.forEach((filter) => {
                const field = 'field' in filter ? filter.field : '';
                if (filter.value == null || filter.value === "") return;
                const value = String(filter.value);

                if (resource === 'subjects') {
                    if (field === 'departmentId' || field === 'department') params.department = value;
                    if (field === 'name' || field === 'code' || field === 'q') params.search = value;
                }

                if (resource === 'classes') {
                    if (field === 'name' || field === 'q') params.search = value;
                    if (field === 'subjectId' || field === 'subject') params.subject = value;
                    if (field === 'teacherId' || field === 'teacher') params.teacher = value;
                }

                if (resource === 'users') {
                    if (field === 'role') params.role = value;
                    if (field === 'name' || field === 'email' || field === 'q') params.search = value;
                }

                if (resource === 'departments') {
                    if (field === 'name' || field === 'code' || field === 'q') params.search = value;
                }
            });

            const response = await axiosInstance.get<ListResponse>(resource, { params });

            return {
                data: response.data.data ?? [],
                total: response.data.pagination?.total ?? response.data.data?.length ?? 0,
            };
        } catch (error) {
            throw buildHttpError(error as AxiosError);
        }
    },

    getOne: async ({ resource, id }) => {
        try {
            const response = await axiosInstance.get<GetOneResponse>(`${resource}/${id}`);
            return {
                data: response.data.data,
            };
        } catch (error) {
            throw buildHttpError(error as AxiosError);
        }
    },

    create: async ({ resource, variables }) => {
        try {
            const response = await axiosInstance.post<CreateResponse>(resource, variables);
            return {
                data: response.data.data,
            };
        } catch (error) {
            throw buildHttpError(error as AxiosError);
        }
    },

    update: async ({ resource, id, variables }) => {
        try {
            const response = await axiosInstance.put<CreateResponse>(`${resource}/${id}`, variables);
            return {
                data: response.data.data,
            };
        } catch (error) {
            throw buildHttpError(error as AxiosError);
        }
    },

    deleteOne: async ({ resource, id }) => {
        try {
            const response = await axiosInstance.delete<CreateResponse>(`${resource}/${id}`);
            return {
                data: response.data.data,
            };
        } catch (error) {
            throw buildHttpError(error as AxiosError);
        }
    },


custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    try {
        let requestUrl = `${url}`;

        if (query) {
            const queryParams = new URLSearchParams();
            Object.entries(query).forEach(([key, value]) => {
                queryParams.append(key, String(value));
            });
            requestUrl = `${requestUrl}?${queryParams.toString()}`;
        }

        console.log('🌐 Custom API Request:', requestUrl);

        const response = await axiosInstance.request({
            url: requestUrl,
            method: method || 'get',
            data: payload,
            headers,
        });

        console.log('✅ Custom API Response:', response.data);
        
        // ✅ Log what we're actually returning
        const returnValue = { data: response.data };
        console.log('🔄 Returning from custom method:', returnValue);

        return returnValue;
    } catch (error) {
        console.error('❌ Custom API Error:', error);
        throw buildHttpError(error as AxiosError);
    }
},


    getApiUrl: () => BACKEND_BASE_URL,
};