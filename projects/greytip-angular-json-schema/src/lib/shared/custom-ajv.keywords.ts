import { isValidDate, dateWithoutTime } from './date.functions';
/**
 * Custom Ajv keywords for validation.
 * https://epoberezkin.github.io/ajv/custom.html
 * @type {Array}
 */
export const CUSTOM_AJV_KEYWORDS = [

	/**
 	 * minDate: Compares the date with minimum date inclusively.
 	 * Supports exclusive check if parentSchema has exclusiveMinDate as 'true'
 	 */
    {
    	name: 'minDate',
    	definition: {
    		// A valid date string.
    	    type: 'string',
    	    $data: true, // Can reference to other fields in schema.
    	    /**
    	     * Validator function which compares minDate with date.
    	     * @type {boolean}
    	     */
    	    validate: (schemaDate, date, parentSchema): boolean => {
    	    	schemaDate = new Date(schemaDate);
				date = new Date(date);
				if(!isValidDate(schemaDate) || !isValidDate(date)){
					// can not validate with respect to in valid dates.
					return true;
				}
				// Removing timezone.
				schemaDate = dateWithoutTime(schemaDate);
				date = dateWithoutTime(date);
				if(parentSchema.exclusiveMinDate) {
					return schemaDate.getTime() < date.getTime();
				}
				return schemaDate.getTime() <= date.getTime();
			}
    	}
    },

    /**
 	 * maxDate: Compares the date with maximum date inclusively.
 	 * Supports exclusive check if parentSchema has exclusiveMaxDate as 'true'
 	 */
    {
    	name: 'maxDate',
    	definition: {
    		// A valid date string.
    	    type: 'string',
    	    $data: true, // Can reference to other fields in schema.
    	    /**
    	     * Validator function which compares maxDate with date.
    	     * @type {boolean}
    	     */
    	    validate: (schemaDate, date, parentSchema): boolean => {
    	    	schemaDate = new Date(schemaDate);
				date = new Date(date);
				if(!isValidDate(schemaDate) || !isValidDate(date)) {
					// can not validate with respect to in valid dates.
					return true;
				}
				// Removing timezone.
				schemaDate = dateWithoutTime(schemaDate);
				date = dateWithoutTime(date);
				if(parentSchema.exclusiveMaxDate) {
					return schemaDate.getTime() > date.getTime();
				}
				return schemaDate.getTime() >= date.getTime();
			}
    	}
    }
];