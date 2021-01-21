import { Observable } from "rxjs/Observable";
import { User } from "../../models/user";
import { Subject } from "rxjs/Subject";

export interface IAuthService {

    /**
     * Subscribe to get Login Status Change events
     */
    loginStatusChanged : Subject<boolean> 
    /**
     * Returns user object on successfull logged in 
     * @param userId
     * @param password
     * @returns {Obaservable<User>}
     */
    checkLogin (user : User) : Observable<any>;
    
    /**
     * Register a new user with Auth server
     * @param user
     * @returns {Observable<User>}
     */
    register(user : User) : Observable<User>;

    /**
     * Update Registered user
     * @param user
     * @return {Observable<User>}
     */
    update(user: User) : Observable<User>;

    /**
     * Returns response after sending email link to user
     * @returns {Observable<User>}
     */    
    forgotPassword(user : User) : Observable<User>;

    /**
     * Returns response after resetting password
     * @returns {Observable<User>}
     */    
    resetPassword(user : User, key: string) : Observable<any>;

    /**
     * Returns specified key to verify user's account
     * @returns {Observable<any>}
     */    
    verifyKey(key : string) : Observable<any>;

    /**
     * Resend email to verify account
     * @returns {Observable<any>}
     */ 
    resendEmail(user:User): Observable<any>;

    /**
     * Returns token from local Storage, if a user is logged in otherwise returns an empty string
     * @returns {string}
     */    
    getToken() : string;


    /**
     * Returns Logged In User or null if a user is not logged in yet
     * @returns {User}
     */
    getLoggedinUser() : User;
    
    /**
     * Returns true if a user is logged in otherwise returns false
     * @returns {boolean}
     */
  //  isLoggedIn() : boolean;

    /**
     * Check if entity name (i.e brnad name, agency name or influcener agent name)
     * is available (200 http status code)
     */
    checkEntityNameAvailability(entityName, entityType) : Observable<any>;

    /**
     * Check if email is available
     */
    checkEmailAvailability(emailAddress, entityType) : Observable<any>;

    /**
     * Store user in local storage
     */
    storeUser(user: User);


    /**
     * get user from local storage
     */
    getUser():User;

    /**
     * Store url in local storage
     */
    storeUrlPath(urlPath: string);

    /**
     * Verify email
     */
    verifyEmail(email: String);


    /**
     * get url from local storage
     */
    getUrlPath():string;

    /**
     * remove user from local storage
     */
    logoutUser();

}