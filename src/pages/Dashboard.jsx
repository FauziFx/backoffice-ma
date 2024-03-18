import React from "react";
import { Container, Card } from "react-bootstrap";

function Dashboard() {
  return (
    <Container className="pt-4">
      <h3>Dashboard</h3>
      <Card>
        <Card.Body>
          <Card.Title>
            <h4>Selamat Datang di Backoffice</h4>
          </Card.Title>
          <Card.Text>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat,
            quos id iure laborum accusamus fuga ipsum quasi iusto nesciunt
            dolores.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Dashboard;
