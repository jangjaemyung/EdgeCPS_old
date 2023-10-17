import json
from collections import OrderedDict
import re

data = {"dd_5#act2": '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="5" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="2" target="4"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="2" value="" style="ellipse;fillColor=#000000;shape=startState;strokeColor=none;" vertex="1" parent="1"><mxGeometry x="410" y="70" width="30" height="30" as="geometry"/></mxCell><mxCell id="7" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="4" target="6"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="9" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0.5;entryY=0;entryDx=0;entryDy=0;" edge="1" parent="1" source="4" target="8"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="4" value="&lt;div style=&quot;font-weight:bold;&quot;&gt;&amp;lt;&amp;lt;Script&amp;gt;&amp;gt;&lt;br&gt;[name]&lt;/div&gt;" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="360" y="140" width="120" height="60" as="geometry"/></mxCell><mxCell id="6" value="&lt;div style=&quot;font-weight:bold;&quot;&gt;&amp;lt;&amp;lt;Container&amp;gt;&amp;gt;&lt;br&gt;[name]&lt;/div&gt;" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="305" y="290" width="120" height="60" as="geometry"/></mxCell><mxCell id="8" value="&lt;div style=&quot;font-weight:bold;&quot;&gt;&amp;lt;&amp;lt;Script&amp;gt;&amp;gt;&lt;br&gt;[name]&lt;/div&gt;" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="450" y="290" width="120" height="60" as="geometry"/></mxCell></root></mxGraphModel>',

        "dd_5#act2_flowDict" : {5:[2,4],7:[4,6],9:[4,8],0000:[2,4]}
        }

activity_full_name = "dd_5#act2"
project_name = activity_full_name.split('_')[0]
activity_name = activity_full_name.split('#')[1]
activity_id = activity_full_name.split('#')[0][-1]

flow_dict_value= data[activity_full_name+'_flowDict']
except_start_end= [value for key, value in flow_dict_value.items() if key not in [0000, 9999]]
# values = list(flow_dict_value.values())
set_values = first_values_set = set(x[0] for x in except_start_end) 
# step의 depth
depth = len(set_values)+1

# depth만큼 배열 초기화
templates = [['' for j in range(1)] for i in range(depth)]

xml_data = data[activity_full_name]
xml_data = re.sub(r'<mxGraphModel><root>', '', xml_data)
xml_data = re.sub(r'</root></mxGraphModel>', '', xml_data)
xml_data = xml_data.split('</mxCell>')


frame = OrderedDict()
workflow = OrderedDict()
spec = OrderedDict()

frame['namespace'] = 'argo'
frame['serverDryRun'] = 'false'
frame['workflow'] = workflow

workflow['apiVersion'] = 'argoproj.io/v1alpha1'
workflow['kind'] = 'Workflow'
workflow['metadata'] = {'name': activity_name}
workflow['spec'] = spec

spec['entrypoint'] = activity_name
spec['templates'] = templates


templates.append(data)



print(json.dumps(frame, ensure_ascii=False, indent="\t"))

with open('{filename}.json', 'w', encoding='utf=8') as make_file:
    json.dump(frame, make_file, ensure_ascii=False, indent='\t')