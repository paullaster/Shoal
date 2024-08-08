import { DateTime } from "luxon"

class DateClass{
    /**
     * 
     * @param {*} date string
     * @returns formdate 
     */
        toDate(date) {
            return DateTime.fromISO(date).toFormat('yyyy LLL dd');
        }
        /**
         * @param {*} dobString string
         * @returns age
         */
        calculateAge(dobString) {
            // Convert the DOB string to a Date object
            const dob = new Date(dobString);
          
            // Get the current date
            const today = new Date();
          
            // Calculate the age
            let age = today.getFullYear() - dob.getFullYear();
            let month = today.getMonth() - dob.getMonth();
          
            // Adjust for cases where the birthday hasn't passed yet
            if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
              age--;
            }
          
            return age;
          }
    }

    export default new DateClass();
    