import React, { useEffect, useState } from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Fetch transactions and categories on component mount
  useEffect(() => {
    // Fetch transactions
    fetch("http://localhost:8080/trans")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        // Calculate total income and expense
        let income = 0;
        let expense = 0;
        data.forEach((item) => {
          if (item.Type === "Income") income += item.Amount;
          if (item.Type === "Expense") expense += item.Amount;
        });
        setTotalIncome(income);
        setTotalExpense(expense);
      })
      .catch((error) => console.error("Error fetching transactions:", error));

    // Fetch categories
    fetch("http://localhost:8080/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Calculate Revenue as the difference between Income and Expense
  const revenue = totalIncome - totalExpense;

  // Calculate total active categories (assuming 'active' property is in categories)
  const activeCategories = categories.filter(category => category.Status === "Active").length;

  // Group transactions by month and calculate the revenue for each month
  const calculateMonthlyRevenue = () => {
    const monthlyRevenue = {};

    // Iterate through transactions and aggregate income/expense per month
    transactions.forEach((item) => {
      const month = new Date(item.Date).toLocaleString('default', { month: 'short' }) + ' ' + new Date(item.Date).getFullYear();
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = { income: 0, expense: 0 };
      }

      if (item.Type === "Income") {
        monthlyRevenue[month].income += item.Amount;
      }
      if (item.Type === "Expense") {
        monthlyRevenue[month].expense += item.Amount;
      }
    });

    // Prepare data for the chart
    const labels = Object.keys(monthlyRevenue);
    const revenueData = labels.map(month => monthlyRevenue[month].income - monthlyRevenue[month].expense);

    return { labels, revenueData };
  };

  // Prepare chart data
  const { labels, revenueData } = calculateMonthlyRevenue();

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chart text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Income</p>
                      <Card.Title as="h4">${totalIncome}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr />
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-light-3 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Expense</p>
                      <Card.Title as="h4">${totalExpense}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr />
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Revenue</p>
                      <Card.Title as="h4">${revenue}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr />
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="Category">
                      <p className="card-category">Active Categories</p>
                      <Card.Title as="h4">{activeCategories}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr />
              </Card.Footer>
            </Card>
          </Col>
        </Row>

        {/* Graphs Section */}
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Monthly Revenue</Card.Title>
                <p className="card-category">Total revenue per month</p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartHours">
                  <ChartistGraph
                    data={{
                      labels: labels,  // months
                      series: [revenueData],  // revenue data
                    }}
                    type="Line"
                    options={{
                      low: 0,
                      high: Math.max(...revenueData) + 100,  // To ensure the chart adjusts to max revenue
                      showArea: false,
                      height: "245px",
                      axisX: {
                        showGrid: false,
                      },
                      lineSmooth: true,
                      showLine: true,
                      showPoint: true,
                      fullWidth: true,
                      chartPadding: {
                        right: 50,
                      },
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="legend">
                  <i className="fas fa-circle text-info"></i>
                  Revenue
                </div>
                <hr />
                <div className="stats"></div>
              </Card.Footer>
            </Card>
          </Col>

          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Statistics</Card.Title>
              </Card.Header>
              <Card.Body>
  <div className="ct-chart ct-perfect-fourth" id="chartPreferences">
    <ChartistGraph
      data={{
        labels: ["Income", "Expense"],
        series: [
          (totalIncome / (totalIncome + totalExpense)) * 100, // Percentage of income
          (totalExpense / (totalIncome + totalExpense)) * 100, // Percentage of expense
        ],
      }}
      type="Pie"
    />
  </div>
  <div className="legend">
    <i className="fas fa-circle text-info"></i>
    Income <i className="fas fa-circle text-danger"></i>
    Expense
  </div>
  <hr />
</Card.Body>

            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
