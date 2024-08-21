import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { useApiQuery, useApiMutation } from '../../support/api/hooks';
import { BackendEndpoint } from '../../support/api/api-schema';
import { Task, TaskStatus } from '../../support/api/models';
import TaskColumn from '../TaskColumn/TaskColumn';
import EditTaskModal from '../EditTaskModal/EditTaskModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TasksView: React.FC = () => {
  const { data, loading, error, refetch } = useApiQuery(
    BackendEndpoint.GetTasks,
    { props: { searchText: '' } },
  );
  const { data: users, loading: userLoading, error: userError, refetch: userRefetch } = useApiQuery(
    BackendEndpoint.GetUsers,
    { props: { searchText: '' } },
  );

  // const [updateTask, { loading: updating, error: updateError }] = useApiMutation(BackendEndpoint.UpdateTask);
  const [updateTask] = useApiMutation(BackendEndpoint.UpdateTask);
  const [tasks, setTasks] = useState<Task[]>(data || []);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openModalTaskId, setOpenModalTaskId] = useState<string>("");

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Error loading tasks.');
    if (userError) toast.error('Error loading users.');
  }, [error, userError]);

  const openEditModal = (taskId: string) => {
    setOpenModalTaskId(taskId);
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate) {
      setSelectedTask(taskToUpdate);
    } else {
      console.log("Task not found or data is not loaded yet.");
    }
  };

  const closeEditModal = () => {
    setOpenModalTaskId(""); // Clear the modal identifier on close
    setSelectedTask(null);
  };

  const updateTasksInView = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    // if (updating) return <p>Updating...</p>;
    // if (updateError) return <p>Failed to update task: {updateError.message}</p>;
    const originalTask = tasks.find(task => task.id === updatedTask.id);

    if (!originalTask) return

    updateTasksInView(updatedTask);

    setOpenModalTaskId("");

    try {
      await updateTask({
        id: updatedTask.id,
        title: updatedTask.title,
        status: updatedTask.status,
        priority: updatedTask.priority,
        assignedUsers: updatedTask.assignedUsers
      });
      refetch();
    } catch (error) {
      console.error('Failed to update task:', error)
      updateTasksInView(originalTask);
      toast.error('Failed to update task, changes have been reverted.');
    }
  };

  // if (loading || userLoading) return <p>Loading...</p>;

  const statuses = Object.values(TaskStatus);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '.5em',
      maxHeight: '100%',
      overflowY: 'auto',
      padding: '1em',
    }}>
      <ToastContainer />
      <Container maxWidth="md">
        <Grid container spacing={2}>
          {data && tasks && statuses.map((status) => (
            <TaskColumn
              key={status}
              tasks={tasks.filter(task => task.status === status)}
              status={status}
              onEditTask={openEditModal}
            />
          ))}
        </Grid>
      </Container>
      {selectedTask && (openModalTaskId === selectedTask.id) && users && (
        <EditTaskModal
          open={openModalTaskId === selectedTask.id}
          task={selectedTask}
          onClose={closeEditModal}
          onSave={handleTaskUpdate}
          allUsers={users}
        />
      )}
    </div>
  );
};

export default TasksView;
