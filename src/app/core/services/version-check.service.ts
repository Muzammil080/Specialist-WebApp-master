import { Injectable } from '@angular/core';
import { HttpService } from './base/http.service';

@Injectable()
export class VersionCheckService {
    private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

    constructor(private _http: HttpService) {}

    /**
     * Checks in every set frequency the version of frontend application
     * @param {number} frequency - in milliseconds, defaults to 30 minutes
     */
    public initVersionCheck(url, frequency = 1000 * 60 * 30) {
        this.checkVersion(url);
        setInterval(() => {
            this.checkVersion(url);
        }, frequency);
    }

    /**
     * Will do the call and check if the hash has changed or not
     */
    private checkVersion(url) {
        // timestamp these requests to invalidate caches
        this._http.get(url + '?t=' + new Date().getTime()).subscribe(
            (response: any) => {
                const resp = response.json();
                const hash = resp.currentHash;
                const hashChanged = this.hasHashChanged(this.currentHash, hash);
                // If new version, do something
                if (hashChanged) {
                    window.location.reload();
                    // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
                    // for an example: location.reload();
                }
                // store the new hash so we wouldn't trigger versionChange again
                // only necessary in case you did not force refresh
                this.currentHash = hash;
            },
            err => {
                console.error(err, 'Could not get version');
            }
        );
    }

    /**
     * Checks if hash has changed.
     * This file has the JS hash, if it is a different one than in the version.json
     * we are dealing with version change
     * @param currentHash
     * @param newHash
     * @returns {boolean}
     */
    private hasHashChanged(currentHash, newHash) {
        if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
            return false;
        }
        return currentHash !== newHash;
    }
}
