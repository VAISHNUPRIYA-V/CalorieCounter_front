import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { meals, foods } from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

const Dashboard = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dailyMeals, setDailyMeals] = useState([]);
    const [totalDailyCalories, setTotalDailyCalories] = useState(0);
    const [loadingMeals, setLoadingMeals] = useState(true);
    const [loadingFoods, setLoadingFoods] = useState(true);
    const [allFoods, setAllFoods] = useState([]);
    const [mealName, setMealName] = useState('');
    const [selectedFoodItems, setSelectedFoodItems] = useState([]);
    const [foodQuantities, setFoodQuantities] = useState({});
    const [logMealError, setLogMealError] = useState('');
    const [logMealSuccess, setLogMealSuccess] = useState('');

    const fetchMeals = async (date) => {
        setLoadingMeals(true);
        setDailyMeals([]);
        setTotalDailyCalories(0);
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const response = await meals.getDaily(formattedDate);
            setDailyMeals(response.data);
            const total = response.data.reduce((sum, meal) => sum + meal.totalCalories, 0);
            setTotalDailyCalories(total);
        } catch (err) {
            console.error('Error fetching daily meals:', err);
        } finally {
            setLoadingMeals(false);
        }
    };

    const fetchAllFoods = async () => {
        setLoadingFoods(true);
        try {
            const response = await foods.getAll();
            setAllFoods(response.data.map(food => ({
                value: food.id,
                label: `${food.name} (${food.caloriesPerServing} kcal per ${food.servingUnit})`,
                caloriesPerServing: food.caloriesPerServing
            })));
        } catch (err) {
            console.error('Error fetching all foods:', err);
        } finally {
            setLoadingFoods(false);
        }
    };

    useEffect(() => {
        fetchAllFoods();
    }, []);

    useEffect(() => {
        fetchMeals(selectedDate);
    }, [selectedDate]);

    const handleLogMeal = async (e) => {
        e.preventDefault();
        setLogMealError('');
        setLogMealSuccess('');

        if (!mealName.trim()) {
            setLogMealError('Meal name cannot be empty.');
            return;
        }
        if (selectedFoodItems.length === 0) {
            setLogMealError('Please select at least one food item.');
            return;
        }

        const mealData = {
            mealName: mealName,
            mealDate: selectedDate.toISOString().split('T')[0],
            foodItems: selectedFoodItems.map(item => ({
                foodId: item.value,
                quantity: foodQuantities[item.value] || 0
            })).filter(item => item.quantity > 0)
        };

        if (mealData.foodItems.length === 0) {
            setLogMealError('All selected food items must have a quantity greater than zero.');
            return;
        }

        try {
            await meals.log(mealData);
            setLogMealSuccess('Meal logged successfully!');
            setMealName('');
            setSelectedFoodItems([]);
            setFoodQuantities({});
            fetchMeals(selectedDate);
        } catch (err) {
            console.error('Error logging meal:', err.response ? err.response.data : err.message);
            setLogMealError('Failed to log meal: ' + (err.response && typeof err.response.data === 'string' ? err.response.data : 'Server error.'));
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            await meals.delete(mealId);
            setLogMealSuccess('Meal deleted successfully!');
            fetchMeals(selectedDate);
        } catch (err) {
            console.error('Error deleting meal:', err);
            setLogMealError('Failed to delete meal.');
        }
    };

    const handleFoodSelectChange = (selectedOptions) => {
        setSelectedFoodItems(selectedOptions || []);
        const newQuantities = { ...foodQuantities };
        selectedOptions.forEach(option => {
            if (!newQuantities[option.value]) {
                newQuantities[option.value] = 100.0;
            }
        });
        setFoodQuantities(newQuantities);
    };

    const handleQuantityChange = (foodId, quantity) => {
        setFoodQuantities(prev => ({
            ...prev,
            [foodId]: parseFloat(quantity) || 0
        }));
    };

    return (
        <Container style={{ backgroundColor: 'black', color: 'white', padding: '20px' }}>
            <h1 className="text-center mb-4" style={{ color: 'white' }}>Welcome, {user?.username}!</h1>
            <Row className="mb-4 align-items-center">
                <Col md={4}>
                    <h3 className="mb-0" style={{ color: 'white' }}>Daily Summary for:</h3>
                </Col>
                <Col md={4}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        popperPlacement="bottom-start"
                    />
                </Col>
                <Col md={4} className="text-end">
                    <Card body style={{ backgroundColor: '#f95a25', color: 'white' }} className="shadow-sm">
                        Total Calories: {loadingMeals ? <Spinner animation="border" size="sm" /> : <strong>{totalDailyCalories.toFixed(2)}</strong>} kcal
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3" style={{ color: 'black' }}>Log New Meal</Card.Title>
                            {logMealError && <Alert variant="danger">{logMealError}</Alert>}
                            {logMealSuccess && <Alert variant="success">{logMealSuccess}</Alert>}
                            <Form onSubmit={handleLogMeal}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: 'black' }}>Meal Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g., Breakfast, Lunch, Dinner"
                                        value={mealName}
                                        onChange={(e) => setMealName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: 'black' }}>Select Food Items</Form.Label>
                                    {loadingFoods ? (
                                        <div className="text-center" style={{ color: 'black' }}>
                                            <Spinner animation="border" size="sm" /> Loading foods...
                                        </div>
                                    ) : (
                                        <Select
                                            isMulti
                                            options={allFoods}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            onChange={handleFoodSelectChange}
                                            value={selectedFoodItems}
                                            placeholder="Search and select foods..."
                                        />
                                    )}
                                </Form.Group>
                                {selectedFoodItems.length > 0 && (
                                    <div className="mb-3 border p-3 rounded bg-light">
                                        <h5 style={{ color: 'black' }}>Quantities:</h5>
                                        {selectedFoodItems.map(food => (
                                            <Form.Group as={Row} className="mb-2" key={food.value}>
                                                <Form.Label column sm="6" style={{ color: 'black' }}>
                                                    {food.label}
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Quantity (grams/servings)"
                                                        value={foodQuantities[food.value] || ''}
                                                        onChange={(e) => handleQuantityChange(food.value, e.target.value)}
                                                        required
                                                    />
                                                    <Form.Text className="text-muted">
                                                        Approx. {((foodQuantities[food.value] || 0) * food.caloriesPerServing / 100.0).toFixed(2)} kcal
                                                    </Form.Text>
                                                </Col>
                                            </Form.Group>
                                        ))}
                                    </div>
                                )}
                                <Button
                                    variant={null}
                                    type="submit"
                                    className="w-100"
                                    style={{ backgroundColor: '#f95a25', borderColor: '#f95a25', color: 'white' }}
                                >
                                    Log Meal
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3" style={{ color: 'black' }}>
                                Your Meals for {selectedDate.toDateString()}
                            </Card.Title>
                            {loadingMeals ? (
                                <div className="text-center" style={{ color: 'black' }}>
                                    <Spinner animation="border" />
                                </div>
                            ) : dailyMeals.length === 0 ? (
                                <Alert variant="info" className="text-center">No meals logged for this date yet.</Alert>
                            ) : (
                                dailyMeals.map(meal => (
                                    <Card key={meal.id} className="mb-3">
                                        <Card.Header className="d-flex justify-content-between align-items-center bg-light" style={{ color: 'black' }}>
                                            <strong>{meal.mealName}</strong>
                                            <span>Total: {meal.totalCalories.toFixed(2)} kcal</span>
                                        </Card.Header>
                                        <Card.Body>
                                            <ul className="list-unstyled" style={{ color: 'black' }}>
                                                {meal.foodItems.map((item, index) => (
                                                    <li key={index}>
                                                        {item.foodName}: {item.quantity.toFixed(2)} ({item.calculatedCalories.toFixed(2)} kcal)
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="text-end">
                                                <Button
                                                    variant={null}
                                                    size="sm"
                                                    className="me-2"
                                                    style={{ backgroundColor: 'transparent', borderColor: '#f95a25', color: '#f95a25' }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant={null}
                                                    size="sm"
                                                    onClick={() => handleDeleteMeal(meal.id)}
                                                    style={{ backgroundColor: 'transparent', borderColor: '#f95a25', color: '#f95a25' }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
