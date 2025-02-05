import React, { useEffect, useState } from "react";
import { Card, Table, Container, Row, Col, Modal, Button, Form } from "react-bootstrap";

const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

function Expense() {
  const [expense, setExpense] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete confirmation modal
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/trans")
      .then((res) => res.json())
      .then((data) => setExpense(data))
      .catch((error) => console.error("Error fetching expense:", error));
  }, []);

  const handleEditClick = (expenseItem) => {
    setSelectedExpense(expenseItem);
    setShowModal(true);
  };

  const handleDeleteClick = (expenseItem) => {
    setSelectedExpense(expenseItem);
    setShowDeleteModal(true); // Show delete confirmation modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExpense(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedExpense(null);
  };

  const handleSaveChanges = () => {
    if (!selectedExpense) return;

    fetch(`http://localhost:8080/trans/${selectedExpense.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedExpense),
    })
      .then((response) => response.json())
      .then((data) => {
        setExpense((prevExpense) =>
          prevExpense.map((item) => (item.id === data.id ? data : item))
        );
        window.location.reload();
        handleCloseModal();
      })
      .catch((error) => console.error("Error updating expense:", error));
  };

  const handleDelete = () => {
    if (!selectedExpense) return;

    fetch(`http://localhost:8080/trans/${selectedExpense.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setExpense((prevExpense) =>
          prevExpense.filter((item) => item.id !== selectedExpense.id)
        );
        handleCloseDeleteModal(); // Close the delete modal
      })
      .catch((error) => console.error("Error deleting expense:", error));
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">All the Expense</Card.Title>
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
                  {expense.filter((item) => item.Type === "Expense").map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
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
      {selectedExpense && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Expense</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={selectedExpense.Date.slice(0, 10)}
                  onChange={(e) => setSelectedExpense({ ...selectedExpense, Date: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedExpense.Description}
                  onChange={(e) => setSelectedExpense({ ...selectedExpense, Description: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedExpense.Category}
                  onChange={(e) => setSelectedExpense({ ...selectedExpense, Category: e.target.value })}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedExpense.Amount}
                  onChange={(e) => setSelectedExpense({ ...selectedExpense, Amount: e.target.value })}
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
      {selectedExpense && (
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Expense</Modal.Title>
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

export default Expense;
