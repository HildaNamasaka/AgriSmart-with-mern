export default function ActivityTable({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No recent activities</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold text-gray-800">Recent Activities</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.slice(0, 5).map((activity) => (
              <tr key={activity._id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(activity.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{activity.activityType}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{activity.crop}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  KES {activity.cost?.toLocaleString() || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}