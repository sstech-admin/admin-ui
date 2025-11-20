import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronDown,
  Edit3,
  ExternalLink,
  Loader2,
  MessageCircle,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { apiService } from '../../services/api';
import ConfirmationDialog from '../common/ConfirmationDialog';
import AddFundsPagination from '../AddFunds/AddFundsPagination';

interface AddVersionsFormProps {
  onBack: () => void;
}

interface AppVersion {
  _id?: string;
  id?: string;
  versionId?: string;
  latestVersion?: string;
  minimumVersion?: string;
  forceUpdateIos?: boolean;
  forceUpdateAndroid?: boolean;
  appStoreUrl?: string;
  playStoreUrl?: string;
  updateMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

type ModalMode = 'create' | 'edit';

interface VersionFormState {
  latestVersion: string;
  minimumVersion: string;
  appStoreUrl: string;
  playStoreUrl: string;
  updateMessage: string;
  forceUpdateIos: boolean;
  forceUpdateAndroid: boolean;
}

interface VersionPayload {
  latestVersion: string;
  minimumVersion: string;
  forceUpdateIos: boolean;
  forceUpdateAndroid: boolean;
  appStoreUrl?: string;
  playStoreUrl?: string;
  updateMessage?: string;
}

const defaultFormState: VersionFormState = {
  latestVersion: '',
  minimumVersion: '',
  appStoreUrl: 'https://apps.apple.com/app/6742142367',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ainfinity',
  updateMessage: '',
  forceUpdateIos: false,
  forceUpdateAndroid: false,
};

const normalizeVersions = (payload: any): AppVersion[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.versions)) {
    return payload.versions;
  }

  return [];
};

const getVersionId = (version: AppVersion) =>
  version._id || version.id || version.versionId || '';

type ReleaseFilter = 'all' | 'mandatory' | 'optional';

const ManageVersions: React.FC<AddVersionsFormProps> = ({ onBack }) => {
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [formValues, setFormValues] = useState<VersionFormState>(defaultFormState);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AppVersion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [releaseFilter, setReleaseFilter] = useState<ReleaseFilter>('all');
  const [isReleaseDropdownOpen, setIsReleaseDropdownOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showNotification = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  const fetchVersions = useCallback(
    async (options: { showSkeleton?: boolean } = { showSkeleton: true }) => {
      const { showSkeleton = true } = options;

      if (showSkeleton) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      try {
        const response = await apiService.getAppVersions();
        const extracted = normalizeVersions(response?.data ?? response);
        setVersions(extracted);
      } catch (err: any) {
        console.error('Failed to fetch app versions', err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Unable to fetch app versions. Please try again.';
        setError(message);
      } finally {
        if (showSkeleton) {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const sortedVersions = useMemo(() => {
    return [...versions].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [versions]);

  const filteredVersions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const fromTimestamp = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const toTimestamp = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

    return sortedVersions.filter((version) => {
      const matchesSearch = normalizedSearch
        ? [
            version.latestVersion,
            version.minimumVersion,
            version.updateMessage,
            version.appStoreUrl,
            version.playStoreUrl,
            getVersionId(version),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      const isMandatory = Boolean(version.forceUpdateIos || version.forceUpdateAndroid);
      const matchesRelease =
        releaseFilter === 'all'
          ? true
          : releaseFilter === 'mandatory'
          ? isMandatory
          : !isMandatory;

      const createdTime = version.createdAt ? new Date(version.createdAt).getTime() : 0;
      const matchesFrom = fromTimestamp === null || createdTime >= fromTimestamp;
      const matchesTo = toTimestamp === null || createdTime <= toTimestamp;

      return matchesSearch && matchesRelease && matchesFrom && matchesTo;
    });
  }, [sortedVersions, searchTerm, releaseFilter, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredVersions.length / pageSize) || 1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize, versions.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedVersions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredVersions.slice(startIndex, startIndex + pageSize);
  }, [filteredVersions, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(nextPage);
  };

  const handleLimitChange = (limit: number) => {
    setPageSize(limit);
    setCurrentPage(1);
  };

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const getVersionInitials = (versionLabel?: string) => {
    if (!versionLabel) return 'AV';
    const sanitized = versionLabel.replace(/[^A-Za-z0-9]/g, '');
    if (!sanitized) return 'AV';
    return sanitized.slice(0, 2).toUpperCase();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const nextValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;

    setFormValues((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const resetFormState = () => {
    setFormValues(defaultFormState);
    setActiveVersionId(null);
  };

  const openCreateModal = () => {
    setModalMode('create');
    resetFormState();
    setIsModalOpen(true);
  };

  const openEditModal = (version: AppVersion) => {
    const versionId = getVersionId(version);
    if (!versionId) {
      showNotification('Unable to edit this version. Missing identifier.', 'error');
      return;
    }

    setModalMode('edit');
    setActiveVersionId(versionId);
    setFormValues({
      latestVersion: version.latestVersion || '',
      minimumVersion: version.minimumVersion || '',
      appStoreUrl: version.appStoreUrl || defaultFormState.appStoreUrl,
      playStoreUrl: version.playStoreUrl || defaultFormState.playStoreUrl,
      updateMessage: version.updateMessage || '',
      forceUpdateIos: Boolean(version.forceUpdateIos),
      forceUpdateAndroid: Boolean(version.forceUpdateAndroid),
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetFormState();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formValues.latestVersion.trim()) {
      showNotification('Latest version is required', 'error');
      return;
    }

    if (!formValues.minimumVersion.trim()) {
      showNotification('Minimum version is required', 'error');
      return;
    }

    const payload: VersionPayload = {
      latestVersion: formValues.latestVersion.trim(),
      minimumVersion: formValues.minimumVersion.trim(),
      forceUpdateIos: formValues.forceUpdateIos,
      forceUpdateAndroid: formValues.forceUpdateAndroid,
    };

    const appUrl = formValues.appStoreUrl.trim();
    const playUrl = formValues.playStoreUrl.trim();
    const notes = formValues.updateMessage.trim();

    if (appUrl) {
      payload.appStoreUrl = appUrl;
    }
    if (playUrl) {
      payload.playStoreUrl = playUrl;
    }
    if (notes) {
      payload.updateMessage = notes;
    }

    try {
      setIsSaving(true);
      if (modalMode === 'create') {
        await apiService.createAppVersion(payload);
        showNotification('Version created successfully', 'success');
      } else if (activeVersionId) {
        await apiService.updateAppVersion(activeVersionId, payload);
        showNotification('Version updated successfully', 'success');
      }
      await fetchVersions({ showSkeleton: false });
      handleModalClose();
    } catch (err: any) {
      console.error('Failed to save version', err);
      const message =
        err?.response?.data?.message || err?.message || 'Unable to save the version.';
      showNotification(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const versionId = getVersionId(deleteTarget);
    if (!versionId) {
      showNotification('Unable to delete this version. Missing identifier.', 'error');
      return;
    }

    try {
      setIsDeleting(true);
      await apiService.deleteAppVersion(versionId);
      showNotification('Version deleted successfully', 'success');
      await fetchVersions({ showSkeleton: false });
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Failed to delete version', err);
      const message =
        err?.response?.data?.message || err?.message || 'Unable to delete the version.';
      showNotification(message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderListState = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 space-y-4">
          <Loader2 className="animate-spin" size={32} />
          <p>Loading versions…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center text-center space-y-4">
          <AlertCircle className="text-red-500" size={32} />
          <div>
            <p className="text-red-700 font-semibold mb-2">Unable to load versions</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => fetchVersions()}
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!sortedVersions.length) {
      return (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center space-y-4">
          <MessageCircle className="mx-auto text-gray-400" size={36} />
          <p className="text-lg	font-semibold text-gray-700">No versions yet</p>
          <p className="text-gray-500">
            Publish the first version to manage force updates and store links.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-md hover:from-cyan-600 hover:to-blue-600 transition-colors"
          >
            <Plus size={18} />
            <span>Add Version</span>
          </button>
        </div>
      );
    }

    if (!paginatedVersions.length) {
      return (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
          <AlertCircle className="mx-auto text-gray-400" size={36} />
          <p className="text-lg font-semibold text-gray-800">No versions found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your search to find a version.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Minimum Version
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                App Store
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Play Store
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Update Message
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedVersions.map((version, index) => {
              const versionId = getVersionId(version);
              const initials = getVersionInitials(version.latestVersion);
              return (
                <tr
                  key={versionId || version.latestVersion}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  <td className="px-8 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-xs font-semibold">
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {version.latestVersion || 'Unknown Version'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {versionId ? `#${versionId.slice(-6).toUpperCase()}` : 'Untracked'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {version.minimumVersion || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {version.appStoreUrl ? (
                      <a
                        href={version.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                      >
                        <ExternalLink size={16} />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {version.playStoreUrl ? (
                      <a
                        href={version.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                      >
                        <ExternalLink size={16} />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 max-w-sm line-clamp-2">
                      {version.updateMessage || '—'}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-medium">
                      {formatDate(version.updatedAt || version.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(version)}
                        className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        title="Edit Version"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(version)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Version"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const hasActiveFilters = releaseFilter !== 'all' || fromDate !== '' || toDate !== '' || Boolean(searchTerm);

  const clearFilters = () => {
    setReleaseFilter('all');
    setFromDate('');
    setToDate('');
    setSearchTerm('');
    setCurrentPage(1);
    setIsReleaseDropdownOpen(false);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-white to-gray-50 px-8 py-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">App Versions</h2>
                  <p className="text-sm text-gray-600 mt-1">Monitor and manage app version releases</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search versions..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-10 pr-4 py-2.5 w-72 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
                <button
                  onClick={() => fetchVersions({ showSkeleton: false })}
                  disabled={loading || refreshing}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {refreshing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span className="text-sm font-medium">Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCcw size={18} />
                      <span className="text-sm font-medium">Refresh</span>
                    </>
                  )}
                </button>
                <button
                  onClick={openCreateModal}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md"
                >
                  <Plus size={18} />
                  <span className="text-sm font-medium">Add Version</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setIsReleaseDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors min-w-[150px] justify-between"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {releaseFilter === 'all'
                        ? 'All Releases'
                        : releaseFilter === 'mandatory'
                        ? 'Mandatory'
                        : 'Optional'}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${
                        isReleaseDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isReleaseDropdownOpen && (
                    <div className="absolute z-10 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                      {[
                        { value: 'all', label: 'All Releases' },
                        { value: 'mandatory', label: 'Mandatory' },
                        { value: 'optional', label: 'Optional' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setReleaseFilter(option.value as ReleaseFilter);
                            setIsReleaseDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            releaseFilter === option.value ? 'bg-cyan-50 text-cyan-700' : ''
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(event) => {
                        setFromDate(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none"
                      placeholder="From date"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                      type="date"
                      value={toDate}
                      onChange={(event) => {
                        setToDate(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none"
                      placeholder="To date"
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                    <span className="text-sm font-medium">Clear</span>
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-600">
                Total Versions: <span className="font-semibold text-gray-900">{versions.length}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {renderListState()}
            {filteredVersions.length > 0 && (
              <AddFundsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={filteredVersions.length}
                limit={pageSize}
                hasNext={currentPage < totalPages}
                hasPrev={currentPage > 1}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                loading={loading || refreshing}
              />
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6 relative">
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Add New Version' : 'Edit Version'}
              </h2>
              <p className="text-gray-500 text-sm">
                Define the version metadata for the selected platform.
              </p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latest Version
                  </label>
                  <input
                    type="text"
                    name="latestVersion"
                    value={formValues.latestVersion}
                    onChange={handleInputChange}
                    placeholder="e.g. 1.13"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Version
                  </label>
                  <input
                    type="text"
                    name="minimumVersion"
                    value={formValues.minimumVersion}
                    onChange={handleInputChange}
                    placeholder="e.g. 1.10"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App Store URL
                  </label>
                  <input
                    type="url"
                    name="appStoreUrl"
                    value={formValues.appStoreUrl}
                    onChange={handleInputChange}
                    placeholder="https://apps.apple.com/..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Play Store URL
                  </label>
                  <input
                    type="url"
                    name="playStoreUrl"
                    value={formValues.playStoreUrl}
                    onChange={handleInputChange}
                    placeholder="https://play.google.com/..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex items-center space-x-3 rounded-2xl border border-gray-200 px-4 py-3">
                  <input
                    id="forceUpdateIos"
                    name="forceUpdateIos"
                    type="checkbox"
                    checked={formValues.forceUpdateIos}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Force update on iOS</p>
                    <p className="text-xs text-gray-500">
                      Users must upgrade before using the app.
                    </p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 rounded-2xl border border-gray-200 px-4 py-3">
                  <input
                    id="forceUpdateAndroid"
                    name="forceUpdateAndroid"
                    type="checkbox"
                    checked={formValues.forceUpdateAndroid}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Force update on Android</p>
                    <p className="text-xs text-gray-500">Users on Play Store must update.</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Message</label>
                <textarea
                  name="updateMessage"
                  value={formValues.updateMessage}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="A new version is available..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-5 py-3 font-semibold text-white shadow-lg hover:from-red-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>{modalMode === 'create' ? 'Create Version' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Version"
        message={`Are you sure you want to delete version ${
          deleteTarget?.latestVersion || ''
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        type="danger"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </>
  );
};

export default ManageVersions;
