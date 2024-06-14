import React, { useState } from 'react';

const RecipeForm = ({ open, setCloseForm }) => {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Recipe Name:', recipeName);
        console.log('Ingredients:', ingredients);
        console.log('Instructions:', instructions);
        console.log('Image:', image); // Handle image upload logic here
        // Example of handling close after form submission
        setCloseForm(false);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    const handleClose = () => {
        setCloseForm(false);
    };

    return (
        <>
            {open && (
                <div className="card" style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
                    <div className="card-body">
                        <h5 className="card-title">Submit Your Recipe</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="recipeName" className="form-label">Recipe Name:</label>
                                <input
                                    type="text"
                                    id="recipeName"
                                    className="form-control"
                                    name="recipeName"
                                    value={recipeName}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipeImage" className="form-label">Upload Image:</label>
                                <input
                                    type="file"
                                    id="recipeImage"
                                    className="form-control"
                                    name="recipeImage"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ingredients" className="form-label">Ingredients:</label>
                                <textarea
                                    id="ingredients"
                                    className="form-control"
                                    name="ingredients"
                                    rows="5"
                                    value={ingredients}
                                    onChange={(e) => setIngredients(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="instructions" className="form-label">Instructions:</label>
                                <textarea
                                    id="instructions"
                                    className="form-control"
                                    name="instructions"
                                    rows="5"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="submit" className="btn btn-primary">Submit</button>
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default RecipeForm;
