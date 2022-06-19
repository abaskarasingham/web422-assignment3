import { Card } from "react-bootstrap";

export default function NotFound(){
    return (
        <>
            <br />
            <Card>
                <Card.Header>
                    <div><h1>Not Found</h1><p>We can't find what you're looking for...</p></div>
                </Card.Header>
            </Card>
        </>
    );
}