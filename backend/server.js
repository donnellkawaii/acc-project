const express = require("express");
const admin = require("firebase-admin");
const credentials = require("./key.json");
const cors = require("cors");

const app = express();
// / ✅ Allow requests from frontend (http://localhost:3000)
app.use(cors({
  origin: "http://localhost:3000", 
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// ✅ OR (Allow All Origins - Only for Development)
app.use(cors());

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

// Access Firestore database
const db = admin.firestore();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create category
app.post('/create/category', async (req, res) =>{
  try {
    // const id = req.body.email;
    const userJson = {
      Name: req.body.Name,
      Type: req.body.Type,
      Description: req.body.Description,
      Status: 'Active',
      DateCreated: Date(),
      DateUpdated: null
    }
    const response = await db.collection("category").add(userJson);
    res.send(response)
  } catch (error) {
    res.send(error);
  }
})

// Read category with document ID
app.get("/categories", async (req, res) => {
  try {
    const userRef = db.collection("category");
    const response = await userRef.get();
    let responseArr = [];

    response.forEach(doc => {
      responseArr.push({ id: doc.id, ...doc.data() }); // Include document ID
    });

    res.json(responseArr); // Send JSON response with IDs
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update category by document ID with automatic dateUpdated
app.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get document ID from URL
    const updatedData = req.body; // Get updated data from request body

    const categoryRef = db.collection("category").doc(id);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ error: "Category not found" });
    }

    const currentDate = new Date().toISOString(); // Get current date in ISO format

    await categoryRef.update({
      ...updatedData,
      dateUpdated: currentDate, // Automatically set dateUpdated
    });

    res.json({ id, ...updatedData, DateUpdated: currentDate, message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete category by document ID
app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params; // Get the category ID from the URL parameter
  
  try {
    const userRef = db.collection("category").doc(id); // Reference the category document
    await userRef.delete(); // Delete the document
    
    res.status(200).json({ message: "Category deleted successfully" }); // Send success response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors
  }
});



//create transaction
app.post('/create/trans', async (req, res) =>{
  try {
    // const id = req.body.email;
    const userJson = {
      Date: req.body.Date,
      Description: req.body.Description,
      Category: req.body.Category,
      Type: req.body.Type,
      Amount: req.body.Amount,
    }
    const response = await db.collection("transaction").add(userJson);
    res.send(response)
  } catch (error) {
    res.send(error);
  }
})

// Read transaction
app.get("/trans", async (req, res) => {
  try {
    const userRef = db.collection("transaction");
    const response = await userRef.get();
    let responseArr = [];

    response.forEach(doc => {
      // Add doc.id to each document's data
      responseArr.push({ id: doc.id, ...doc.data() });
    });

    res.json(responseArr);  // Send JSON response with document id
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transaction by document ID
app.delete("/trans/:id", async (req, res) => {
  const { id } = req.params; // Get the transaction ID from the URL parameter
  
  try {
    const userRef = db.collection("transaction").doc(id); // Reference the transaction document
    await userRef.delete(); // Delete the document
    
    res.status(200).json({ message: "Transaction deleted successfully" }); // Send success response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle any errors
  }
});


//read params id
app.get('/read/:id', async (req, res) =>{
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const response = await userRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
})

// Update a specific transaction
app.put("/trans/:id", async (req, res) => {
  const { id } = req.params; // The ID of the transaction to update
  const { Date, Description, Category, Amount, Type } = req.body; // Fields to update

  // Filter out undefined values to prevent them from being sent to Firestore
  const updateData = {};
  if (Date !== undefined) updateData.Date = Date;
  if (Description !== undefined) updateData.Description = Description;
  if (Category !== undefined) updateData.Category = Category;
  if (Amount !== undefined) updateData.Amount = Amount;
  if (Type !== undefined) updateData.Type = Type;

  try {
    // Reference to the document to update
    const userRef = db.collection("transaction").doc(id);

    // Get the document to ensure it exists before updating
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Update the document, excluding undefined fields
    await userRef.update(updateData);

    // Return the updated transaction
    const updatedDoc = await userRef.get();
    res.json(updatedDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//delete
app.delete('/delete/:id', async (req, res) => {
  try {
    const response = await db.collection("users").doc(req.params.id).delete();
    res.send(response);
  } catch (error) {
    res.send(error)
  }
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
