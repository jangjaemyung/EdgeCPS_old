from flask import Flask, render_template, request, redirect, url_for


app = Flask(__name__)

# 임의의 프로젝트 목록 데이터
projects = [
    {'id': 1, 'name': 'Project 1'},
    {'id': 2, 'name': 'Project 2'},
    {'id': 3, 'name': 'Project 3'}
]



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
        username = request.form['username']
        password = request.form['password']

        # todo 로그인 기능 구현 필요  // 로그인시 정보를 저장하는 곳 필요
        return redirect(url_for('project_list'))

    # todo 로그인 정보 오류 알람 필요
    return render_template('index.html')


@app.route('/project/projectsList')
def project_list():

    # todo 프로젝트 리스트 정보 조회하는 기능 필요
    return render_template('projectList.html', projects=projects)


@app.route('/project/create_project', methods=['GET', 'POST']) # todo 프로젝트 생성 로직 전체 적으로 손좀 봐야함 ...
def create_project():

    catlist = ['java', 'python']  # todo 카테고리 정의 요필

    if request.method == 'POST':
        project_name = request.form.get('project_name')
        project_description = request.form.get('project_description')
        project_category = request.form.get('project_category')
        len(projects) +1
        return f"Project created: {project_name}, {project_description}, {project_category}"
    else:
        return render_template('createProject.html', categories=catlist)


@app.route('/projects/delete/<int:project_id>', methods=['POST'])
def delete_project(project_id): # todo 프로젝트 삭제 기능

    # todo 회원의 소속 확인, 회원의 프로젝트인지 확인 필요
    for project in projects:
        if project['id'] == project_id:
            projects.remove(project)
            break
    return redirect(url_for('project_list'))


@app.route('/projects/open/<int:project_id>')
def open_project(project_id):
    # todo 프로젝트 열기 -> 무조건 첫번째는 overview 혹은 Requirement

    return redirect(url_for('project', project_id=project_id))









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
    active_overview = True
    return render_template('process/overviewProcess.html', active_overview=active_overview)

@app.route('/process/requirementsProcess', methods=['GET', 'POST'])
def requirements_process():
    active_requirements = True
    return render_template('process/requirementsProcess.html', active_requirements=active_requirements)

@app.route('/process/businessProcess', methods=['GET', 'POST'])
def business_process():
    active_process = True
    return render_template('process/businessProcess.html', active_process=active_process)

@app.route('/process/workflowProcess', methods=['GET', 'POST'])
def workflow_process():
    active_workflow = True
    return render_template('process/workflowProcess.html', active_workflow=active_workflow)

@app.route('/process/searchReusablesProcess', methods=['GET', 'POST'])
def search_reusables_process():
    active_reusables = True
    return render_template('process/searchReusablesProcess.html', active_reusables=active_reusables)

@app.route('/process/workflowImplementationProcess', methods=['GET', 'POST'])
def workflow_implementation_process():
    active_implementation = True
    return render_template('process/workflowImplementationProcess.html', active_implementation=active_implementation)

@app.route('/process/policyProcess', methods=['GET', 'POST'])
def policy_process():
    active_policy = True
    return render_template('process/policyProcess.html', active_policy=active_policy)

@app.route('/process/runProcess', methods=['GET', 'POST'])
def run_process():
    active_run = True
    return render_template('process/runProcess.html', active_run=active_run)


if __name__ == '__main__':
    app.run()
