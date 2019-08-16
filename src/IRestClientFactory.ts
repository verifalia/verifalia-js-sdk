import { MultiplexedRestClient } from "./MultiplexedRestClient";

export interface IRestClientFactory {
    build(): MultiplexedRestClient;
}
