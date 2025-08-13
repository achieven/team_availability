'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AppDispatch, RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { fetchCurrentStatus, updateStatus, clearError } from '../../store/slices/statusSlice';
import { fetchTeamMembers } from '../../store/slices/teamSlice';

interface StatusForm {
  status: string;
}

const statusOptions = [
  { value: 'available', label: 'Available', color: 'bg-green-500' },
  { value: 'busy', label: 'Busy', color: 'bg-red-500' },
  { value: 'away', label: 'Away', color: 'bg-yellow-500' },
  { value: 'offline', label: 'Offline', color: 'bg-gray-500' },
];

export default function StatusPage() {
  console.log('StatusPage component rendered');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { currentStatus, loading, error } = useSelector((state: RootState) => state.status as any);
  const { members: teamMembers, loading: teamLoading } = useSelector((state: RootState) => state.team);
  const hasRedirected = useRef(false);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  
  console.log('Auth state:', { isAuthenticated, user });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StatusForm>();

  useEffect(() => {
    console.log('StatusPage useEffect triggered - isAuthenticated:', isAuthenticated, 'hasRedirected:', hasRedirected.current);
    
    if (!isAuthenticated && !hasRedirected.current) {
      console.log('Redirecting to login');
      hasRedirected.current = true;
      router.push('/login');
      return;
    }
    
    if (isAuthenticated) {
      console.log('Fetching current status');
      dispatch(fetchCurrentStatus());
      dispatch(fetchTeamMembers(user?.id || ''));
    }
  }, [isAuthenticated]); // Remove router and dispatch from dependencies

  useEffect(() => {
    if (currentStatus) {
      setValue('status', currentStatus.status);
    }
  }, [currentStatus, setValue]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  const onSubmit = async (data: StatusForm) => {
    await dispatch(updateStatus(data.status));
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.label || 'Unknown';
  };

  // Filter team members based on search term and status filter
  const filteredTeamMembers = teamMembers?.filter((member) => {
    const matchesSearch = searchTerm === '' || 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter.length === 0 || 
      (member.status && statusFilter.includes(member.status));
    
    return matchesSearch && matchesStatus;
  }) || [];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Update Your Status
                </h2>
                <p className="text-sm text-gray-600">
                  Hello {user?.name}, you are {currentStatus?.status}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update my current status to:
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>



              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Update Status'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Team Members Section */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
            <span className="text-sm text-gray-500">
              {filteredTeamMembers.length} of {teamMembers?.length || 0} members
            </span>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
            {/* Search Input */}
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Search team members</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search by name or email..."
                />
              </div>
            </div>
            
            {/* Status Filter Dropdown */}
            <div className="sm:w-48 relative" ref={statusDropdownRef}>
              <label htmlFor="status-filter" className="sr-only">Filter by status</label>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <span className="block truncate">
                  {statusFilter.length === 0 
                    ? 'All Statuses' 
                    : statusFilter.length === 1 
                      ? statusOptions.find(opt => opt.value === statusFilter[0])?.label 
                      : `${statusFilter.length} Statuses Selected`
                  }
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              {isStatusDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {statusOptions.map((option) => (
                    <label key={option.value} className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={statusFilter.includes(option.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStatusFilter([...statusFilter, option.value]);
                          } else {
                            setStatusFilter(statusFilter.filter(status => status !== option.value));
                          }
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-gray-900">{option.label}</span>
                    </label>
                  ))}
                  {statusFilter.length > 0 && (
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <button
                        onClick={() => {
                          setStatusFilter([]);
                          setIsStatusDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-primary-600 hover:bg-gray-100"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {teamLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredTeamMembers.length > 0 ? (
            <div className="space-y-3">
              {filteredTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {member.name?.charAt(0)?.toUpperCase() || member.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.status && (
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)}`}></div>
                    )}
                    <span className="text-xs text-gray-500">
                      {member.status ? getStatusLabel(member.status) : 'Unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <p className="text-gray-500 text-center py-4">No team members match your search criteria</p>
          ) : (
            <p className="text-gray-500 text-center py-4">No team members found</p>
          )}
        </div>
      </div>
    </div>
  );
}
