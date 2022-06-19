import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { Badge, Button, Card, Form } from 'react-bootstrap';
import { useState, useEffect } from "react";

export default function Trip() {

    const { id } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch(`https://guarded-river-44796.herokuapp.com/api/trips/${id}`).then(res => res.json()).then(data => {
            setLoading(false);
            if (data.hasOwnProperty("_id")) {
                setTrip(data);
                setUserData({
                    bikeid: data.bikeid,
                    "birth year": data["birth year"],
                    usertype: data.usertype
                });
            } else {
                setTrip(null);
            }

            
        });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('The Form Was Submitted: ' + JSON.stringify(userData));

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        };
        fetch(`https://guarded-river-44796.herokuapp.com/api/trips/${id}`, requestOptions).then(res => res.json()).then(data => {
            setTrip(data);
            navigate(`/trips`);
        });
    }

    const handleChange = (e) => {
        let target = e.target;
        let value = target.value;
        let name = target.name;

        setUserData(userData => {
            return { ...userData, [name]: value };
        });
    }

    if (loading) {
        return (
            <>
                <br />
                <Card>
                    <Card.Header>
                        <p>Loading Trip Data...</p>
                    </Card.Header>
                </Card>
            </>
        )
    } else {
        if (!userData) {
            return (
                <>
                    <br />
                    <Card>
                        <Card.Header>
                            <p>Unable to find Trip with id: {id}</p>
                        </Card.Header>
                    </Card>
                </>
            );
        } else {
            return (
                <>
                    <br />
                    <Card>
                        <Card.Header>
                            <h3>Bike: {trip.bikeid} ({trip.usertype})</h3>
                            <p>{trip["start station name"]} - {trip["end station name"]}</p>
                        </Card.Header>
                    </Card><br />

                    <MapContainer style={{ "height": "400px" }} center={[trip["start station location"].coordinates[1], trip["start station location"].coordinates[0]]} zoom={15}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[trip["start station location"].coordinates[1], trip["start station location"].coordinates[0]]}>
                            <Tooltip permanent direction='right'>Start: {trip["start station name"]}</Tooltip>
                        </Marker>
                        <Marker position={[trip["end station location"].coordinates[1], trip["end station location"].coordinates[0]]}>
                            <Tooltip permanent direction='right'>End: {trip["end station name"]}</Tooltip>
                        </Marker>
                    </MapContainer><br /><br />

                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Bike ID</Form.Label>
                            <Form.Control type="number" name="bikeid" value={userData.bikeid} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Birth Year</Form.Label>
                            <Form.Control type="number" name="birth year" value={userData["birth year"]} onChange={handleChange} />
                        </Form.Group>
                        <Form.Check
                            type="radio"
                            label="Subscriber"
                            name="usertype"
                            value="Subscriber"
                            id="subscriber"
                            checked={userData.usertype === "Subscriber"}
                            onChange={handleChange}
                        />
                        <Form.Check
                            type="radio"
                            label="Customer"
                            name="usertype"
                            value="Customer"
                            id="customer"
                            checked={userData.usertype === "Customer"}
                            onChange={handleChange}
                        />
                        <hr />
                        <Link to="/Trips" className="btn btn-secondary float-right ml-1">Back to Trips</Link>
                        <Button type="submit" className="float-right" >Update Trip User</Button>
                    </Form>
                </>
            );
        }
    }


}