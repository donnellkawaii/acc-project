import React, { useEffect, useState } from "react";
import { Card, Table, Container, Row, Col, Modal, Button, Form } from "react-bootstrap";

const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

function Income() {
  const [income, setIncome] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete confirmation modal
  const [selectedIncome, setSelectedIncome] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/trans")
      .then((res) => res.json())
      .then((data) => setIncome(data))
      .catch((error) => console.error("Error fetching income:", error));
  }, []);

  const handleEditClick = (incomeItem) => {
    setSelectedIncome(incomeItem);
    setShowModal(true);
  };

  const handleDeleteClick = (incomeItem) => {
    setSelectedIncome(incomeItem);
    setShowDeleteModal(true); // Show delete confirmation modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncome(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedIncome(null); // Ensure the selected income is reset
  };
  

  const handleSaveChanges = () => {
    if (!selectedIncome) return;

    fetch(`http://localhost:8080/trans/${selectedIncome.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedIncome),
    })
      .then((response) => response.json())
      .then((data) => {
        setIncome((prevIncome) =>
          prevIncome.map((item) => (item.id === data.id ? data : item))
        );
        window.location.reload()
        handleCloseModal();
      })
      .catch((error) => console.error("Error updating income:", error));
  };

  const handleDelete = () => {
    if (!selectedIncome) return;
  
    fetch(`http://localhost:8080/trans/${selectedIncome.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update the income list by filtering out the deleted item
        setIncome((prevIncome) =>
          prevIncome.filter((item) => item.id !== selectedIncome.id)
        );
        // Close the delete modal and reset selectedIncome
        handleCloseDeleteModal();
      })
      .catch((error) => console.error("Error deleting income:", error));
  };
  

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">All the Income</Card.Title>
              <p className="card-category">You can add, edit, delete here.</p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    <th className="border-0">ID</th>
                    <th className="border-0">Date</th>
                    <th className="border-0">Description</th>
                    <th className="border-0">Category</th>
                    <th className="border-0">Amount</th>
                    <th className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {income.filter((item) => item.Type === "Income").map((item, index) => (
                    <tr key={item.id}>
                      <td value={item.id}>{index + 1}</td>
                      <td>{formatDate(item.Date)}</td>
                      <td>{item.Description}</td>
                      <td>{item.Category}</td>
                      <td>{item.Amount}</td>
                      <td>
                        <span
                          className="nc-icon nc-settings-tool-66"
                          onClick={() => handleEditClick(item)}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        ></span>
                        <span
                          className="nc-icon nc-simple-remove"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteClick(item)} // Trigger delete confirmation modal
                        ></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      {selectedIncome && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Income</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedIncome.Date.slice(0, 10)}
                  onChange={(e) => setSelectedIncome({ ...selectedIncome, Date: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIncome.Description}
                  onChange={(e) => setSelectedIncome({ ...selectedIncome, Description: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIncome.Category}
                  onChange={(e) => setSelectedIncome({ ...selectedIncome, Category: e.target.value })}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedIncome.Amount}
                  onChange={(e) => setSelectedIncome({ ...selectedIncome, Amount: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {selectedIncome && (
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Income</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this record?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default Income;
