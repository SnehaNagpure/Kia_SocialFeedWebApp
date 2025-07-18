import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api/users';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: any; // Update with your User type if you have one
}

interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
    isAuthenticated: false,
};

// Async thunk for login using fetch
export const loginUser = createAsyncThunk<
  LoginResponse,              // Return type on success
  LoginCredentials,           // Argument type
  { rejectValue: string }     // ThunkAPI options
>(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // Try to parse error message from response
        const errorData = await response.json().catch(() => null);
       // const message = errorData?.message || 'Login failed';
        if (response.status === 401 && errorData?.error === 'Invalid email or password.') {
          return thunkAPI.rejectWithValue('Invalid credentials');
        }
        return thunkAPI.rejectWithValue('An unexpected error occurred. Please try again later.');
      }

      const data: LoginResponse = await response.json();
      
      return data; // Should contain { token, user }
    } catch (error) {
      return thunkAPI.rejectWithValue('Network error: Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
         state.isAuthenticated = true;
         // Save to localStorage
         const user = {
          _id: action.payload.user._id,
          username: action.payload.user.username,
          email: action.payload.user.email,
          firstName: action.payload.user.firstName,
          lastName: action.payload.user.lastName,
          profilePicture: action.payload.user.profilePicture,
        };

          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
         state.isAuthenticated = false;
      });
      
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
