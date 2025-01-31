export const ensureAuthenticated = (req, res, next) => {
    if (req.session.admin_id) {
        return next();
    }
    req.flash('error', 'Please log in to access this resource');
    res.redirect('/adminLogin');
};

export const ensureGuest = (req, res, next) => {
    if (!req.session.admin_id) {
        return next();
    }
    res.redirect('/dashboard');
};
