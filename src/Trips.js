import { useState, useEffect } from "react";
import { Badge, Card, Pagination, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Trips() {

    const [trips, setTrips] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch(`https://guarded-river-44796.herokuapp.com/api/trips?page=${page}&perPage=${10}`).then(res => res.json()).then(result => {
            setTrips(result);
            setLoading(false);
        })
    }, [page]);

    function previousPage() {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    }

    function nextPage() {
        setPage(prev => prev + 1);
    }

    if (loading) {
        return (
            <>
                <br />
                <Card>
                    <Card.Header>
                        <p>Loading Trips...</p>
                    </Card.Header>
                </Card>
            </>
        )
    } else {
        return (
            <>
                <br />
                <Card>
                    <Card.Header>
                        <h3>Trips List</h3>
                        <p>Full list of Citibike Trips.</p>
                        <div className="float-right">
                            <Badge className="Subscriber" bg="secondary">Subscribers</Badge>
                            <Badge className="Customer" bg="secondary">Customers</Badge>
                        </div>
                    </Card.Header>
                </Card><br />
    
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>Bike Id</th>
                            <th>Start Station</th>
                            <th>End Station</th>
                            <th>Duration (Minutes)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map(trip =>
                            <tr onClick={() => { navigate(`/trip/${trip._id}`) }} className={trip.usertype}>
                                <td>{trip.bikeid}</td>
                                <td>{trip["start station name"]}</td>
                                <td>{trip["end station name"]}</td>
                                <td>{(trip.tripduration / 60).toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
    
                <Pagination>
                    <Pagination.Prev onClick={() => { previousPage() }}/>
                    <Pagination.Item>{page}</Pagination.Item>
                    <Pagination.Next onClick={() => { nextPage() }}/>
                </Pagination>
            </>
        );
    }

    
}