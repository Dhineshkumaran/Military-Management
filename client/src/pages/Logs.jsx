import React, { useState, useEffect } from 'react';
import { Clock, User, Activity } from 'lucide-react';
import { getLogs } from '../api/logs';
import { useAuth } from '../contexts/AuthContext';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const data = await getLogs(auth);
    setLogs(data);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Activity Logs
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {logs.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No logs found
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.log_id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {log.action_type}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      by User #{log.user_id}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{JSON.stringify(log.details)}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(log.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logs;