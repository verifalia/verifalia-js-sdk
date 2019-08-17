import { MultiplexedRestClient } from "./MultiplexedRestClient";

export interface RestClientFactory {
    build(): MultiplexedRestClient;
}
