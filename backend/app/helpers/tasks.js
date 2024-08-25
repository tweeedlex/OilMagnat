const getUserTasksInfo = async (db, tgId) => {
	const user = await db.User.findOne({ tgId });

	const completedTasksIds = user.completedTasks;

	// Используем агрегацию для получения всех задач и установки поля isCompleted

	const result = await db.Task.aggregate([
		{
			$addFields: {
				isCompleted: {
					$cond: {
						if: { $in: ["$_id", completedTasksIds] },
						then: true,
						else: false,
					},
				},
			},
		},
		{
			$facet: {
				tasks: [{ $sort: { order: -1 } }],
				totalAvailableReward: [{ $match: { isCompleted: false } }, { $group: { _id: null, total: { $sum: "$reward" } } }],
				completedCount: [{ $match: { isCompleted: true } }, { $count: "count" }],
			},
		},
	]);

	let tasksWithCompletionStatus = result[0].tasks;
	const availableReward = result[0].totalAvailableReward[0] ? result[0].totalAvailableReward[0].total : 0;
	const completedTasksAmount = result[0].completedCount[0] ? result[0].completedCount[0].count : 0;

	// sort by order field from greatest to smallest
	tasksWithCompletionStatus.sort((a, b) => b.order - a.order);

	// filter hidden
	tasksWithCompletionStatus = tasksWithCompletionStatus.filter(task => !task.hidden);

	return { tasks: tasksWithCompletionStatus, availableReward, completedTasksAmount };
};

module.exports = {
	getUserTasksInfo,
};
