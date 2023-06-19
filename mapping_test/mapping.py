dict = {"apiVersion":"argoproj.io/v1alpha1" , 
        "kind":"Workflow", 
        "metadata_name": "wf-artifact3",
        "spec_entrypoint":"dag-template",
        "spec_arguments_parameters_name":"message1",
        "spec_arguments_parameters_value": "Task 1 is executed", 
        "spec_templates_name":"dag-template","spec_templates_inputs_parameters_name": "message1",
        "spec_templates_dag_tasks_name": "task1"
        }

result = []
mapping_file_path = '/home/kpst/Desktop/mapping'

for key in dict.keys():
    i=0
    with open(mapping_file_path, 'r') as file:
        lines = file.readlines()
        for line in lines:
            if key in line:
                key_index = line.index(key)
                substring = line[key_index + len(key) + 1:-1]
                substring = substring.split('@')
                result_list = []
                result_list.append(substring)
                result_list.append(dict[key])
                dict_name = str(i) + 'result'
                dict_name = []
                dict_name= result_list
                i=i+1
                result.append(dict_name)
                print(dict_name)
                break

print(result)