import json
from collections import OrderedDict
import ast

dict = {
    "apiVersion": "argoproj.io/v1alpha1",
        "kind": "Workflow",
        "metadata_name": "wf-artifact3",
        "spec_entrypoint": "dag-template",
        "spec_arguments_parameters_name": "message1",
        "spec_arguments_parameters_value": "Task 1 is executed",
        "spec_templates_name": "dag-template", "spec_templates_inputs_parameters_name": "message1",
        "spec_templates_dag_tasks_name": "task1",
        "spec_templates_dag_tasks_arguments_parameters": "[{name: text, value: '{{inputs.parameters.message1}}'}]",
        "spec_templates_dag_tasks_template": "task-template",
        "spec_templates_name": "task-template",
        "spec_templates_inputs_parameters_name": "text",
        "spec_templates_container_image": "python:3.8-slim",
        "spec_templates_container_command": "[python]",
        "spec_templates_container_args": "['-c', 'param = \'{{inputs.parameters.text}}\'; print(param)']"
        }

result = []
result1 = ""
mapping_file_path = '/home/minsoo/Downloads/EdgeCPS_git/'

# for key in dict.keys():
#     i = 0
#     with open(mapping_file_path, 'r') as file:
#         lines = file.readlines()
#         for line in lines:
#             if key in line:
#                 x = ''
#                 y = ''
#                 key_index = line.index(key)
#                 substring = line[key_index + len(key) + 1:-1]
#                 substring = substring.split('@')
#                 substring_length = len(substring)
#                 result_list = []
#                 result_list.append(substring)
#                 result_list.append(dict[key])
#                 if substring_length == 1:
#
#                     y = str(substring[0]) + ':' + str(dict[key]) + ','
#                     result1 = result1 + y
#                 elif substring_length > 1:
#                     # if substring ==old_substring:
#                     # index = result1.fild('}')
#                     # result1 = ','+result1[:index]+str(substring[substring_length])+':'+dict[key]
#                     # break
#                     x = str(substring[substring_length - 1]) + ':' + str(dict[key])
#                     for i in range(substring_length - 2, -1, -1):
#                         x = str(substring[i]) + '{' + x + '}'
#                     result1 = result1 + x + ','
#                 result.append(result_list)
#                 old_x = x
#                 old_substring = substring
#                 print(result_list)
#                 break

#value를 생성하는 곳
def convert_value(value):
    try:
        return ast.literal_eval(value)
    except SyntaxError:
        return value
    except ValueError:
        return value

#이름 짤라 주는 함수
def insert_value(key, value, dictionary):
    keys = key.split('_')
    current_dict = dictionary
    for k in keys[:-1]:
        if k not in current_dict:
            current_dict[k] = OrderedDict()
        current_dict = current_dict[k]
    current_dict[keys[-1]] = convert_value(value)


# _ 를 기준으로 밖에서 부터 생성
o_dic = OrderedDict()
for k,v in dict.items():
    if '_'in k:
        insert_value(k, v, o_dic)

    else:
        o_dic[k] = vast.literal_eval(value)

print(o_dic)


# OrderedDict를 JSON으로 변환
json_data = json.dumps(o_dic)

# JSON 데이터를 파일에 저장
with open('test_data.json', 'w') as file:
    file.write(json_data)