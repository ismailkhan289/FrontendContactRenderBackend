import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const FooterApp = () => {
    return (
        <footer className="footer">
            <Container>
                <Row>
                    <Col className="text-center py-3">
                        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default FooterApp;