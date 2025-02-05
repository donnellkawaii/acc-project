import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, Dropdown, Button, Modal, Form } from "react-bootstrap";
import routes from "routes.js";

function Header() {
  const location = useLocation();
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // States for form data
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryType, setCategoryType] = useState('Income'); // Default value "Income"
  const [error, setError] = useState(''); // State for error message

  //transaction state
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionCategory, setTransactionCategory] = useState(""); // Default: "Income"
  const [transactionType, setTransactionType] = useState(""); // Initially empty
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories");
        const data = await response.json();
        // Filter active categories only
        const activeCategories = data.filter(category => category.Status === "Active");
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSaveTransaction = async () => {
    if (!transactionDate || !transactionDescription || !transactionCategory || transactionAmount <= 0) {
      setError("Please fill in all fields correctly.");
      return;
    }

    // Find the full category object
    const selectedCategory = categories.find(category => category.id === transactionCategory);

    if (!selectedCategory) {
      setError("Selected category is invalid.");
      return;
    }

    const transactionData = {
      Date: transactionDate,
      Description: transactionDescription,
      Category: selectedCategory.Name, // Use category name instead of id
      Type: transactionType,  // Use the dynamically set type
      Amount: parseFloat(transactionAmount),
    };

    try {
      const response = await fetch('http://localhost:8080/create/trans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Transaction created successfully:", data);
        setShowAddTransactionModal(false);
        window.location.reload();
      } else {
        console.error("Error creating transaction:", data);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };


  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  // Handlers for Modals
  const handleShowAddTransaction = () => setShowAddTransactionModal(true);
  const handleCloseAddTransaction = () => setShowAddTransactionModal(false);

  const handleShowAddCategory = () => setShowAddCategoryModal(true);
  const handleCloseAddCategory = () => setShowAddCategoryModal(false);

  // Handle saving category via API call
  const handleSaveCategory = async () => {
    // Check if the fields are empty
    if (!categoryName || !categoryDescription || !categoryType) {
      setError("Please fill in all fields.");
      return;
    }

    const categoryData = {
      Name: categoryName,
      Type: categoryType,
      Description: categoryDescription,
    };

    try {
      const response = await fetch('http://localhost:8080/create/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success (e.g., show a success message or close the modal)
        console.log("Category created successfully:", data);
        setShowAddCategoryModal(false);
        window.location.reload();
      } else {
        // Handle error
        console.error("Error creating category:", data);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
            <Button
              variant="dark"
              className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
              onClick={mobileSidebarToggle}
            >
              <i className="fas fa-ellipsis-v"></i>
            </Button>
            <Navbar.Brand href="#home" onClick={(e) => e.preventDefault()} className="mr-2">
              {getBrandText()}
            </Navbar.Brand>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
            <span className="navbar-toggler-bar burger-lines"></span>
            <span className="navbar-toggler-bar burger-lines"></span>
            <span className="navbar-toggler-bar burger-lines"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="nav mr-auto" navbar>
              <Nav.Item>
                <Nav.Link
                  data-toggle="dropdown"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                  className="m-0"
                >
                  <i className="nc-icon nc-palette"></i>
                  <span className="d-lg-none ml-1">Dashboard</span>
                </Nav.Link>
              </Nav.Item>
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  as={Nav.Link}
                  data-toggle="dropdown"
                  id="dropdown-67443507"
                  variant="default"
                  className="m-0"
                >
                  <i className="nc-icon nc-planet"></i>
                  <span className="notification">5</span>
                  <span className="d-lg-none ml-1">Notification</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#pablo" onClick={(e) => e.preventDefault()}>
                    Notification 1
                  </Dropdown.Item>
                  <Dropdown.Item href="#pablo" onClick={(e) => e.preventDefault()}>
                    Notification 2
                  </Dropdown.Item>
                  <Dropdown.Item href="#pablo" onClick={(e) => e.preventDefault()}>
                    Notification 3
                  </Dropdown.Item>
                  <Dropdown.Item href="#pablo" onClick={(e) => e.preventDefault()}>
                    Notification 4
                  </Dropdown.Item>
                  <Dropdown.Item href="#pablo" onClick={(e) => e.preventDefault()}>
                    Another notification
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Nav.Item>
                {/* <Nav.Link
                  className="m-0"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="nc-icon nc-zoom-split"></i>
                  <span className="d-lg-block"> Search</span>
                </Nav.Link> */}
              </Nav.Item>
            </Nav>
            <Nav className="ml-auto" navbar>
              <Nav.Item>
                {/* <Nav.Link className="m-0" href="#pablo" onClick={(e) => e.preventDefault()}>
                  <span className="no-icon">Account</span>
                </Nav.Link> */}
              </Nav.Item>
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle
                  aria-expanded={false}
                  aria-haspopup={true}
                  as={Nav.Link}
                  data-toggle="dropdown"
                  id="navbarDropdownMenuLink"
                  variant="default"
                  className="m-0"
                >
                  <span className="no-icon">Add Item</span>
                </Dropdown.Toggle>
                <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                  <Dropdown.Item onClick={handleShowAddTransaction}>Add Transaction</Dropdown.Item>
                  <Dropdown.Item onClick={handleShowAddCategory}>Add Category</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Nav.Item>
                {/* <Nav.Link className="m-0" href="#pablo" onClick={(e) => e.preventDefault()}>
                  <span className="no-icon">Log out</span>
                </Nav.Link> */}
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal for Add Category */}
      <Modal className="custom-modal" show={showAddCategoryModal} onHide={handleCloseAddCategory}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formCategoryDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formCategoryType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </Form.Control>
            </Form.Group>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Show error message */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddCategory}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveCategory}>Yes</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Add Transaction */}
      <Modal className="custom-modal" show={showAddTransactionModal} onHide={handleCloseAddTransaction}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTransactionDate">
              <Form.Label>Transaction Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter transaction date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formTransactionDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formTransactionCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={transactionCategory}
                onChange={(e) => {
                  const selectedCategoryId = e.target.value;
                  setTransactionCategory(selectedCategoryId);

                  // Find the category by its ID to set the type dynamically
                  const selectedCategory = categories.find(category => category.id === selectedCategoryId);
                  if (selectedCategory) {
                    setTransactionType(selectedCategory.Type); // Set type based on category
                  }
                }}
              >
                <option value="">Select a Category</option>
                {categories
                  .filter(category => category.Status === "Active") // Filter only active categories
                  .map((category, index) => (
                    <option key={category.id || index} value={category.id}>
                      {category.Name}
                    </option>
                  ))}



              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formTransactionType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={transactionType} // Display the dynamically updated type
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="formTransactionAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="Number"
                placeholder="Enter amount"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
              />
            </Form.Group>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Show error message */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddTransaction}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveTransaction}>Save</Button>
        </Modal.Footer>
      </Modal>

    </>

  );
}

export default Header;
