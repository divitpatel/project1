export default function bpReimagineHealthRouter(req, res, next) {
    //bpServerLogger.debug("Got a GET request for the health request");
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ status: 'UP' }));
}