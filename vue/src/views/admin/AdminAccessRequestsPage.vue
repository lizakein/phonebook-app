<template>
  <div>
    <AdminDashboard />
    <div class="admin-access-requests">
      <h2 class="access-title">Запросы на доступ</h2>
      <div class="filter-container">
        <div class="filter-item">
          <label for="status-filter">Фильтр по статусу</label>
          <select 
            id="status-filter" 
            v-model="selectedStatus" 
            @change="fetchAccessRequests"
          >
            <option value="">Все</option>
            <option value="pending">Ожидает</option>
            <option value="accepted">Одобрено</option>
            <option value="rejected">Отклонено</option>
          </select>
        </div>
        <div class="filter-item">
          <label for="sort-order">Сортировка по дате</label>
          <select 
            id="sort-order" 
            v-model="sortOrder" 
            @change="fetchAccessRequests"
          >
            <option value="DESC">От новых к старым</option>
            <option value="ASC">От старых к новым</option>
          </select>
        </div>
      </div>  
      <table>
        <thead>
          <tr>
            <th>Запрашивающий</th>
            <th>Запрашиваемый</th>
            <th>Статус</th>
            <th>Действие</th>
            <th>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in accessRequests" :key="request.id">
            <td>
              <router-link :to="'/profile/' + request.requester_id">{{ request.requesterFullName }}</router-link>
            </td>
            <td>
              <router-link :to="'/profile/' + request.owner_id">{{ request.ownerFullName }}</router-link>
            </td>
            <td>{{ request.status }}</td>
            <td>
              <select v-model="request.newStatus" @change="updateStatus(request.id, request.newStatus)">
                <option value="pending">Ожидает</option>
                <option value="accepted">Одобрено</option>
                <option value="rejected">Отклонено</option>
              </select>
            </td>
            <td>{{ request.created_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import AdminDashboard from '@/components/admin/AdminDashboard.vue';
import apiProvider from '@/services/apiProvider';
import errorHelper from '@/helpers/errorHelper';

export default {
  name: 'AdminAccessRequests',
  components: {
    AdminDashboard
  },
  data() {
    return {
      accessRequests: [],
      selectedStatus: '',
      sortOrder: 'DESC'
    };
  },
  async created() {
    await this.fetchAllAccessRequests();
  },
  methods: {
    async fetchAllAccessRequests() {
      try {
        this.accessRequests = await apiProvider.fetchAllAccessRequests({ status: this.selectedStatus, sortOrder: this.sortOrder });
      } catch (error) {
        console.error(errorHelper.error('ACCESS', 'REQUEST_FETCH_ERROR'), error);
      }
    }, 
    async updateAccessRequestStatus(requestId, newStatus) {
      try {
        await apiProvider.updateAccessRequestStatus(requestId, newStatus)
        this.fetchAllAccessRequests();
      } catch (error) {
        console.error(errorHelper.error('ACCESS', 'STATUS_UPDATE_ERROR'), error);
      }
    }
  }
};
</script>

<style scoped>
.admin-access-requests {
  padding: 20px;
}

.access-title {
  margin-top: 60px;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

#status-filter,
#sort-order {
  margin-left: 10px;
}

table {
  color: white;
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 10px;
  border: 1px solid #0464ca;
}

td {
  padding: 5px;
  color: black;
  border: 1px solid #0464ca;
}

th {
  background-color: #0464ca;
}

select {
  padding: 5px;
}
</style>
