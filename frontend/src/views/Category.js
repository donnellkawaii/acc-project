import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Form
} from "react-bootstrap";

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

function Category() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch("http://localhost:8080/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const handleSaveChanges = () => {
    if (!selectedCategory) return;

    const updatedCategory = {
      ...selectedCategory,
      DateUpdated: new Date().toISOString(),
    };

    fetch(`http://localhost:8080/categories/${selectedCategory.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCategory),
    })
      .then((res) => res.json())
      .then(() => {
        fetchCategories(); // Reload categories after update
        handleCloseModal();
      })
      .catch((error) => console.error("Error updating category:", error));
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as="h4">All the Categories</Card.Title>
              <p className="card-category">You can add, edit, delete here.</p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    <th className="border-0">ID</th>
                    <th className="border-0">Name</th>
                    <th className="border-0">Type</th>
                    <th className="border-0">Description</th>
                    <th className="border-0">Date Created</th>
                    <th className="border-0">Date Updated</th>
                    <th className="border-0">Status</th>
                    <th className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id}>
                      <td>{index + 1}</td>
                      <td>{category.Name}</td>
                      <td>{category.Type}</td>
                      <td>{category.Description}</td>
                      <td>{formatDate(category.DateCreated)}</td>
                      <td>{formatDate(category.DateUpdated)}</td>
                      <td>{category.Status}</td>
                      <td>
                        <span
                          className="nc-icon nc-settings-tool-66"
                          style={{ cursor: "pointer", marginRight: "10px" }}
                          onClick={() => handleEditClick(category)}
                        ></span>
                        {/* <span className="nc-icon nc-simple-remove" style={{ cursor: "pointer" }}></span> */}
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
      {selectedCategory && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCategory.Name}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, Name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formType">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCategory.Type}
                  readOnly
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, Type: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCategory.Description}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, Description: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCategory.Status}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, Status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Control>
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
    </Container>
  );
}

export default Category;
