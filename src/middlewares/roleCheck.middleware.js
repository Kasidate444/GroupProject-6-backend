export const isArtistOrAdmin = (req, res, next) => {
    const { role } = req.user;

    if (role === 'artist' || role === 'admin') {
        return next();
    }

    return res.status(403).json({ success: false, error: "Access denied." });
};


export const isAdmin = (req, res, next) => {
    const { role } = req.user;
    
    // if (req.user?.role === 'admin') {
    if( role === 'admin') {
        return next();
    }

    return res.status(403).json({ success: false, error: 'Admin access denied.' });
};
