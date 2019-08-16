export interface VerifaliaRestClientConfiguration {
    /**
     * The username to use while authenticating to the Verifalia API. While using your Verifalia
     * main account credentials is possible, it is strongly advised to create one or more users
     * (formerly known as sub-accounts) with just the required permissions, for improved security.
     * To create a new user or manage existing ones, please visit https://verifalia.com/client-area#/users
     */
    username: string;

    /**
     * The password to use while authenticating to the Verifalia API. While using your Verifalia
     * main account credentials is possible, it is strongly advised to create one or more users
     * (formerly known as sub-accounts) with just the required permissions, for improved security.
     * To create a new user or manage existing ones, please visit https://verifalia.com/client-area#/users
     */
    password: string;
}