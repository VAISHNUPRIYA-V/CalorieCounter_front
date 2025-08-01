import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Table, Spinner } from 'react-bootstrap';
import { foods } from '../api';

const FoodManagement = () => {
    const [foodName, setFoodName] = useState('');
    const [caloriesPerServing, setCaloriesPerServing] = useState('');
    const [servingUnit, setServingUnit] = useState('');
    const [foodsList, setFoodsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const response = await foods.getAll();
            setFoodsList(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching foods:', err);
            setError('Failed to fetch food items.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleAddFood = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await foods.add({ name: foodName, caloriesPerServing: parseFloat(caloriesPerServing), servingUnit });
            setSuccess('Food item added successfully!');
            setFoodName('');
            setCaloriesPerServing('');
            setServingUnit('');
            fetchFoods(); 
        } catch (err) {
            console.error('Error adding food:', err.response ? err.response.data : err.message);
            setError('Failed to add food item. ' + (err.response && typeof err.response.data === 'string' ? err.response.data : ''));
        }
    };

    return (

        <Container style={{ color: 'white', padding: '20px' }}>
            <h1 className="text-center mb-4" style={{ color: 'white' }}>Food Management</h1>

            <Row>
                <Col md={5}>
                    <Card className="shadow-sm mb-4"> 
                        <Card.Body>
                            <Card.Title style={{ color: 'black' }}>Add New Food Item</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}
                            <Form onSubmit={handleAddFood}>
                                <Form.Group className="mb-3" controlId="foodName">
                                    <Form.Label style={{ color: 'black' }}>Food Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g., Apple, Chicken Breast"
                                        value={foodName}
                                        onChange={(e) => setFoodName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="calories">
                                    <Form.Label style={{ color: 'black' }}>Calories Per Serving</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        placeholder="e.g., 95.0"
                                        value={caloriesPerServing}
                                        onChange={(e) => setCaloriesPerServing(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="servingUnit">
                                    <Form.Label style={{ color: 'black' }}>Serving Unit</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g., 1 medium, 100g, 1 cup"
                                        value={servingUnit}
                                        onChange={(e) => setServingUnit(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button
                                    variant={null} 
                                    type="submit"
                                    className="w-100"
                                    style={{ backgroundColor: '#f95a25', borderColor: '#f95a25', color: 'white' }} 
                                >
                                    Add Food
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={7}>
                    <Card className="shadow-sm"> 
                        <Card.Body>
                            <Card.Title style={{ color: 'black' }}>Available Food Items</Card.Title>
                            {loading ? (
                                <div className="text-center" style={{ color: 'black' }}><Spinner animation="border" /></div>
                            ) : foodsList.length === 0 ? (
                                <Alert variant="info" className="text-center">No food items added yet.</Alert>
                            ) : (
                                <Table striped bordered hover responsive className="mt-3">
                                    <thead>
                                        <tr>
                                            <th style={{ color: 'black' }}>ID</th>
                                            <th style={{ color: 'black' }}>Name</th>
                                            <th style={{ color: 'black' }}>Calories/Serving</th>
                                            <th style={{ color: 'black' }}>Serving Unit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foodsList.map((food) => (
                                            <tr key={food.id}>
                                                <td style={{ color: 'black' }}>{food.id}</td>
                                                <td style={{ color: 'black' }}>{food.name}</td>
                                                <td style={{ color: 'black' }}>{food.caloriesPerServing.toFixed(2)}</td>
                                                <td style={{ color: 'black' }}>{food.servingUnit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FoodManagement;
