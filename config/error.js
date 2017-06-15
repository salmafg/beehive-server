module.exports = {
    missingParameter: function(param) {
        return 'Missing parameter "' + param + '".';
    },
    invalidRequest: 'Invalid request.',
    unknownError: 'An unknown error has occurred.',
    confirmPassword: 'Password and Confirm password do not match.',
    unauthorized: 'Sorry, you are not authorized to view this page.',
    alreadyExists: function(item) {
        return 'This ' + item + ' already exists.';
    },
    notFound: function(item) {
        return item + ' does not exist.';
    },
    createFail: function(item) {
        return 'An error occurred while creating the ' + item + '.';
    },
    updateFail: function(item) {
        return 'An error occurred while updating the ' + item + '.';
    },
    deleteFail: function(item) {
        return 'An error occurred while deleting the ' + item + '.';
    },
    updateSuccess: function(item) {
        return item + ' updated successfully.';
    },
    deleteSuccess: function(item) {
        return item + ' deleted successfully.';
    }
};
