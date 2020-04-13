export const format = (telephoneObject) => {
    if (telephoneObject !== null) {
        let telephoneNumber = telephoneObject.telephone;

        if (telephoneNumber.slice(0, 2) == '+1') {
            telephoneNumber = telephoneNumber.slice(2);
        }
        if (telephoneNumber.length == 10) {
            let areaCode = telephoneNumber.slice(0, 3);
            let prefix = telephoneNumber.slice(3, 6);
            let lineNumber = telephoneNumber.slice(6, 10);
            return `(${areaCode})${prefix}-${lineNumber}`;
        } else {
            return telephoneNumber;
        }
    } else {
        return '';
    }
};

export const selectPrimaryTelephone = (person) => {
    if (person == null) {
        return null;
    }

    if (person.telephones == null) {
        return null;
    }

    if (person.telephones.length === 0) {
        return null;
    }

    return person.telephones[0];
};

export const numbersOnly = (telephoneObject) => {
    if (telephoneObject == null) {
        return '';
    }

    return telephoneObject.telephone.replace(/\D/g, '');
};
