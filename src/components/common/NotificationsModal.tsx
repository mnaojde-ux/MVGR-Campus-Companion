import React from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  Calendar, 
  AlertTriangle, 
  BookOpen, 
  Navigation,
  Check
} from 'lucide-react';
import { CampusNotification } from '../../data/notifications';

interface NotificationsModalProps {
  notifications: CampusNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSelectNotificationAction: (placeId?: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onSelectNotificationAction,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-900" />
            <h2 className="text-sm font-bold text-slate-900">Campus Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-blue-800 hover:text-blue-900"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Items */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {notifications.map((n) => {
            const getCategoryBadge = (cat: string) => {
              switch (cat) {
                case 'Exam': return 'bg-amber-50 text-amber-800 border-amber-200';
                case 'Attendance': return 'bg-orange-50 text-orange-800 border-orange-200';
                case 'Campus': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
                default: return 'bg-blue-50 text-blue-800 border-blue-200';
              }
            };

            return (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border transition-colors ${
                  n.read ? 'bg-white border-slate-200' : 'bg-blue-50/40 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryBadge(n.category)}`}>
                    {n.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{n.timestamp}</span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 mt-1">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {n.message}
                </p>

                {n.placeId && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectNotificationAction(n.placeId);
                      }}
                      className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3 fill-blue-900" />
                      <span>Locate on Map</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
