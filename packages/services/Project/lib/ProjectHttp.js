import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ProjectHttp extends Singleton {
  http = HttpService.getInstance();


  getProject(projectId) {
    return this.http.get(`/api/v2/project/${projectId}`);
  }

  getProjects(projectsIds) {
    const query = qs.stringify({ projectsIds });
    return this.http.get(`/api/v2/projects?${query}`);
  }

  getTeamDefaultProject(teamId) {
    return this.http.get(`/api/v2/project/default/${teamId}`);
  }

  createProject(req) {
    return this.http.post('/api/v2/project', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  getProjectPendingInvites(projectId) {
    return this.http.get(`/api/invites/research/${projectId}`);
  }

  updateProject(req) {
    return this.http.put('/api/v2/project', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  deleteProject(req) {
    return this.http.put(`/api/v2/project/delete`, req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  // change all routes to req msg

  getPublicProjectListing(filter) {
    let query = qs.stringify({ filter });
    return this.http.get(`/api/research/listing?${query}`);
  }

  getUserProjectListing(username) {
    return this.http.get(`/api/research/user/listing/${username}`);
  }

  getTeamProjectListing(teamId) {
    return this.http.get(`/api/research/group/listing/${teamId}`);
  }

  getTenantProjectListing() {
    return this.http.get(`/api/research/listing`);
  }

  createProjectApplication({ proposalId, formData }) {
    return this.http.post(`/api/research/application`, formData, {
      headers: {
        'Proposal-Id': proposalId,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  editProjectApplication({ proposalId, formData }) {
    return this.http.put(`/api/research/application/${proposalId}`, formData, {
      headers: {
        'Proposal-Id': proposalId,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  approveProjectApplication({ tx }) {
    return this.http.post('/api/research/application/approve', { tx });
  }

  rejectProjectApplication({ tx }) {
    return this.http.post('/api/research/application/reject', { tx });
  }

  deleteProjectApplication({ tx }) {
    return this.http.post('/api/research/application/delete', { tx });
  }  

  getProjectApplications({ status, project }) {
    let query = status ? `?status=${status}` : '';
    query = project ? query ? `${query}&researcher=${project}` : `?researcher=${project}` : query;
    return this.http.get(`/api/research/application/listing${query}`);
  }
}

export {
  ProjectHttp
};
