import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
  { value: 'learner', label: 'Student' },
  { value: 'admin', label: 'Admin' },
  { value: 'instructor', label: 'Teacher' },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    if (!form.confirmPassword) errs.confirmPassword = 'Confirm your password';
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.role) errs.role = 'Role is required';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      // Use role from form or API response
      const userRole = form.role || data.user?.role;
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'instructor') navigate('/instructor');
      else if (userRole === 'learner') navigate('/learner');
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            autoComplete="name"
          />
          {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            autoComplete="email"
          />
          {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            autoComplete="new-password"
          />
          {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select role</option>
            {roles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
        </div>
        {apiError && <div className="text-red-500 text-center">{apiError}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register; 