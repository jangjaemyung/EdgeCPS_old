import glob
import os

from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from db_conn import get_pool_conn
import requests
import urllib3
import db_query
from flask_cors import CORS
import subprocess
import json
urllib3.disable_warnings()

app = Flask(__name__)
CORS(app)
app.secret_key = 'EdgeCPS_workflow'


# 임의의 프로젝트 목록 데이터


# mariadb_pool = get_pool_conn()


@app.route('/', methods=['GET', 'POST'])
def index():
    """
        info:
            메인 페이지
            아이디와 비밀 번호를 받아서 로그인 한다.
        Args:
            아이디 , 비밀 번호

        Returns:
            성공 : 프로젝트 목록 페이지 이동
            실패 : 다시 로그인
        """
    if request.method == 'POST':
        session['userid'] = 'tempUser' # todo 로그인 없이 되도록
        return redirect(url_for('project_list',loginUserInfo ='tempUser')) # todo 로그인 없이 되도록

        userid = request.form['userid']
        password = request.form['password']
        login = db_query.login(mariadb_pool,id = userid,pwd = password )

        if login['login']:
            session['userId'] = userid
            return redirect(url_for('project_list'))
        else:
            return render_template('index.html',login_msg='로그인 실패. 일치하는 회원이 없습니다.' )

    return render_template('index.html', login_msg='')
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return render_template('index.html')

@app.route('/project/projectsList', methods=['GET', 'POST'])
def project_list():
    loginUserInfo = request.args.get('loginUserInfo')
    pj_dir = glob.glob('project_file/*')
    projects = [ ]
    idx = 1
    for file_path in pj_dir:
        pj_info = file_path.split('/')[-1]
        pj_user = pj_info.split('_')[-1]
        pj_name = pj_info.split('_')[:-1]
        result = '_'.join(pj_name)
        projects.append({'id': idx, 'name': result, 'user': pj_user})
        idx += 1


    # todo 프로젝트 리스트 정보 조회하는 기능 필요
    return render_template('projectList.html', projects=projects, loginUserInfo=loginUserInfo)


@app.route('/projects/delete/<int:project_id>', methods=['POST'])
def delete_project(project_id): # todo 프로젝트 삭제 기능
    pj_dir = glob.glob('project_file/*')
    projects = []
    idx = 1
    for file_path in pj_dir:
        pj_info = file_path.split('/')[-1]
        pj_user = pj_info.split('_')[-1]
        pj_name = pj_info.split('_')[:-1]
        result = '_'.join(pj_name)
        projects.append({'id': idx, 'name': result, 'user': pj_user})
        idx += 1

    # # todo 회원의 소속 확인, 회원의 프로젝트인지 확인 필요
    for project in projects:
        if project['id'] == project_id:
            rm_dir_name = '_'.join([project['name'],project['user']])
            os.rmdir('project_file/'+rm_dir_name)
            break

    return redirect(url_for('project_list'))


@app.route('/projects/open/<int:project_id>')
def open_project(project_id):
    # todo 프로젝트 열기 -> 무조건 첫번째는 overview 혹은 Requirement

    return redirect(url_for('project', project_id=project_id))




"""
프로젝트 전체 저장 페이지
"""
@app.route('/saveProject', methods=['POST'])
def save_project():
    try:
        data = request.json
        proj_name =data['projectName']++'.json'

        pj_root_pth = 'project_file'
        if os.path.exists(pj_root_pth):
            pj_pth = os.path.join(pj_root_pth ,data['projectName'])
            os.makedirs(pj_pth)
        else:
            response = {"status": "Downlaod error", "message": 'Project path dose not exist'}
            return jsonify(response), 500


        full_pth = os.path.join(pj_pth,proj_name)

        with open(full_pth, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent="\t", ensure_ascii=False)

        response = {"status": "success", "message": "Project data saved successfully."}
        return jsonify(response), 200
    except Exception as e:
        response = {"status": "error", "message": str(e)}
        return jsonify(response), 500



"""
프로세스 페이지
"""

@app.route('/projects/open_process/<int:project_id>', methods=['GET', 'POST'])
def open_process(project_id):
    # overview process
    active_overview = True
    return render_template('process/requirementsProcess.html', project_id=project_id, active_overview=active_overview)


@app.route('/process/overviewProcess', methods=['GET', 'POST'])
def overview_process():
    catlist = ['java', 'python']
    active_overview = True

    if request.method == 'POST': # 프로젝트 생성
        project_name = request.form.get('project_name')
        project_description = request.form.get('project_description')
        project_category = request.form.get('project_category')
        return redirect(url_for('requirements_process', project_name=project_name))

    if request.method == 'GET': #최초이동
        new_pj = request.args.get('newPj')
        project_name = request.args.get('projectName')
        return render_template('process/overviewProcess.html', active_overview=active_overview, categories=catlist, new_pj=new_pj,project_name=project_name)

    # return render_template('process/overviewProcess.html', active_overview=active_overview,categories = catlist)


@app.route('/process/requirementsProcess', methods=['GET', 'POST'])
def requirements_process():
    active_requirements = True

    if request.method == 'GET':
        project_name = request.args.get('project_name')
        if not project_name:
            project_name = request.args.get('projectName')
            if not project_name:
                return redirect(url_for('overview_process', newPj=True))


        return render_template('process/requirementsProcess.html', active_requirements=active_requirements , project_name=project_name)

    # return render_template('process/requirementsProcess.html', active_requirements=active_requirements)


@app.route('/process/businessProcess', methods=['GET', 'POST'])
def business_process():
    active_process = True
    if request.method == 'GET':
        project_name = request.args.get('projectName')
        return render_template('process/businessProcess.html', active_process=active_process, project_name=project_name)

@app.route('/process/workflowProcess', methods=['GET', 'POST'])
def workflow_process():
    active_workflow = True
    if request.method == 'GET':
        project_name = request.args.get('projectName')
        return render_template('process/workflowProcess.html', active_workflow=active_workflow, project_name=project_name)

@app.route('/process/policyProcess', methods=['GET', 'POST'])
def policy_process():
    active_policy = True
    if request.method == 'GET':
        project_name = request.args.get('projectName')
        return render_template('process/policyProcess.html', active_policy=active_policy, project_name=project_name)

@app.route('/process/runProcess', methods=['GET', 'POST'])
def run_process():
    active_run = True
    if request.method == 'GET':
        project_name = request.args.get('projectName')
        return render_template('process/runProcess.html', active_run=active_run, project_name=project_name)




#############""" 아르고 """#########
NAMESPACE = 'argo'
ARGO_SERVER_URL = 'https://localhost:2746'
activity_dic = {}

def search_images(keyword):
    url = f'https://hub.docker.com/v2/search/repositories'
    params = {'query': keyword}

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if 'results' in data:
            image_list = [result['repo_name'] for result in data['results']]
            return image_list
    return None
    
def argo_logs_workflow(workflow_name):
    api_url = f"{ARGO_SERVER_URL}/api/v1/workflows/{NAMESPACE}/{workflow_name}/log?logOptions.container=main"
    response = requests.get(api_url, verify=False)
    if response.status_code == 200:
        logs = response.text
        return logs
    else:
        print(f"Failwd to fetch logs. Status code: {response.status_code}")
        return None
    
def argo_status_workflow(workflow_name):
    api_url = f"{ARGO_SERVER_URL}/api/v1/workflows/{NAMESPACE}/{workflow_name}"
    response = requests.get(api_url, verify=False)
    if response.status_code == 200:
        status = response.text
        return status
    else:
        print(f"FFailed to load status. Status code: {response.status_code}")
        return None
    
def search_local_images():
    output = subprocess.check_output(['docker', 'images', '--format', '{{.Repository}}']).decode().strip()

    # 이미지 이름을 리스트로 변환
    image_list = output.split('\n')

    return image_list

# activity_dic
@app.route('/submit', methods=['POST'])
def submit_workflow():
    try:
        workflow_json = request.get_json()  
        print(workflow_json)
        headers = {
            "Content-Type": "application/json"
        }
        response = requests.post(f"{ARGO_SERVER_URL}/api/v1/workflows/{NAMESPACE}", headers=headers, json=workflow_json, verify=False)
        if response.status_code == 200:
            return "Workflow submitted successfully", 200
        else:
            return "Workflow submission failed", 500
    except Exception as e:
        error_message = str(e)
        return f"Error: {error_message}", 500

@app.route('/stop', methods=['PUT'])
def stop_workflow():
    data = request.get_json()
    workflow_name = data.get('workflowName')
    response = requests.put(f"{ARGO_SERVER_URL}/api/v1/workflows/{NAMESPACE}/"+workflow_name+'/stop', verify=False)
    if response.status_code == 200:
        print("Workflow stop successfully")
        return "Workflow stop successfully", 200
    else:
        print("Workflow stop failed")
        return "Workflow stop failed", 500
        
    
@app.route('/terminate', methods=['PUT'])
def terminate_workflow():
    data = request.get_json()
    workflow_name = data.get('workflowName')
    response = requests.put(f"{ARGO_SERVER_URL}/api/v1/workflows/{NAMESPACE}/"+workflow_name+'/terminate', verify=False)
    if response.status_code == 200:
        print('Workflow terminated successfully')
        return "Workflow terminated successfully", 200
    else:
        print("Workflow terminated failed")
        return "Workflow terminated failed", 500
    
@app.route('/delete', methods=['DELETE'])
def delete_workflow():
    data = request.get_json()
    workflow_name = data.get('workflowName')
    response = requests.delete(f"{ARGO_SERVER_URL}/api/v1/workflows/{NAMESPACE}/"+workflow_name, verify=False)
    if response.status_code == 200:
        print('Workflow deleted successfully')
        return "Workflow deleted successfully", 200
    else:
        print("Workflow deleted failed")
        return "Workflow deleted failed", 500
    

@app.route('/log', methods=['GET'])
def logs_workflow():
    workflow_name = request.args.get('workflow_name')
    logs = argo_logs_workflow(workflow_name)
    activity_dic[workflow_name+'_log'] = logs
    return logs

@app.route('/status', methods = ['GET'])
def staus_workflow():
    workflow_name = request.args.get('workflow_name')
    status = argo_status_workflow(workflow_name)
    activity_dic[workflow_name+'_status'] = status
    return status

@app.route('/search', methods=['GET', 'POST'])
def search():
    data = request.get_json()
    inputValue = data['inputValue']

    keyword = inputValue
    if not keyword:
        return jsonify({'error': 'Missing keyword parameter.'}), 400
    images = search_images(keyword)
    if images:
        print(images)
        return jsonify({'images': images}), 200
    else:
        return jsonify({'error': 'Failed to retrieve image list.'}), 500

@app.route('/localsearch', methods=['GET', 'POST'])
def searchlocal():

    images = search_local_images()
    if images:
        print(images)
        return jsonify({'images': images}), 200
    else:
        return jsonify({'error': 'Failed to retrieve image list.'}), 500

@app.route('/open', methods=['GET', 'POST'])
def projectOpen():
    return render_template('/open.html')



if __name__ == '__main__':
    app.run(debug=True)
