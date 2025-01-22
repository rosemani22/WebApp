import React, { useState, useEffect} from 'react';
import './UserForm.css'; // Import the CSS file
import axios from 'axios';


const UserForm = ({user, onSubmit, onCancel, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        website: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        website: user.website,
      });
    }
  }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.id) newErrors.id = 'Id is required';
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.website) newErrors.website = 'Website is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setLoading(true);
        
        

        try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
            console.log('User  added:', response.data);
            onSubmitSuccess(response.data); // Call the success callback
            setFormData({ id: '',name: '', username: '', email: '', website: '' }); // Reset form
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ submit: 'Failed to submit the form. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
           
            <form onSubmit={handleSubmit}>
            <div>
                    <label htmlFor="name">ID:</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                    />
                    {errors.id && <p className="error">{errors.id}</p>}
                </div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="website">Website:</label>
                    <input
                        type="text"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                    />
                    {errors.website && <p className="error">{errors.website}</p>}
                </div>
                {errors.submit && <p className="error">{errors.submit}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Add'}
                </button>
            </form>
        </div>
    );
};

export default UserForm;
