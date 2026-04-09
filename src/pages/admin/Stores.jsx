import { useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, MapPin } from 'lucide-react';
import { useStores } from '../../hooks/useStores';
import { useToast } from '../../hooks/useToast';
import { TableSkeleton } from '../../components/admin/Skeleton';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY_FORM = { name: '', address: '', phone: '', openingHours: '', isActive: true };

export default function Stores() {
  const { stores, loading, actionLoading, createStore, updateStore, deleteStore } = useStores();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (store) => {
    setEditItem(store);
    setForm({
      name: store.name || '',
      address: store.address || '',
      phone: store.phone || '',
      openingHours: store.openingHours || '',
      isActive: store.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateStore(editItem.id, form);
        toast.success('Cap nhat chi nhanh thanh cong');
      } else {
        await createStore(form);
        toast.success('Them chi nhanh thanh cong');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteStore(deleteTarget.id);
      toast.success('Da xoa chi nhanh');
    } catch (err) {
      toast.error(err.message);
    }
    setDeleteTarget(null);
  }, [deleteTarget, deleteStore, toast]);

  const toggleActive = async (store) => {
    try {
      await updateStore(store.id, { ...store, isActive: !store.isActive });
      toast.success(store.isActive ? 'Da tat chi nhanh' : 'Da bat chi nhanh');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi nhanh</h1>
          <p className="text-sm text-gray-500 mt-1">{stores.length} chi nhanh</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#2a2a2a] transition-colors"
        >
          <Plus size={16} />
          Them chi nhanh
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Chi nhanh</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Dia chi</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">SDT</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500">Trang thai</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Thao tac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    Chua co chi nhanh nao
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#c8a96e] shrink-0" />
                        <span className="font-medium text-gray-900">{store.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 max-w-[250px] truncate">{store.address || '-'}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{store.phone || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleActive(store)}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          store.isActive
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {store.isActive ? 'Hoat dong' : 'Tam dong'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(store)}
                          className="p-2 text-gray-400 hover:text-[#c8a96e] hover:bg-[#c8a96e]/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(store)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                {editItem ? 'Sua chi nhanh' : 'Them chi nhanh'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ten chi nhanh *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dia chi *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">So dien thoai</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gio hoat dong</label>
                  <input
                    type="text"
                    value={form.openingHours}
                    onChange={(e) => setForm((p) => ({ ...p, openingHours: e.target.value }))}
                    placeholder="7:00 - 22:00"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a96e]"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-[#c8a96e] rounded"
                />
                <span className="text-sm">Dang hoat dong</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] disabled:opacity-60 flex items-center gap-2"
                >
                  {actionLoading && <Loader2 size={14} className="animate-spin" />}
                  {editItem ? 'Cap nhat' : 'Them moi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoa chi nhanh"
        message={`Ban co chac muon xoa "${deleteTarget?.name}"?`}
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
