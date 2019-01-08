import { Node, NodeJson } from './node.model';
import { Link, LinkJson } from './link.model';

export interface SubGraphJson {
  nodes: NodeJson[];
  links: LinkJson[];
}

export interface SubGraph {
  nodes: Node[];
  links: Link[];
}

function updatePinTag(pinJson, mapping) {
  for (let key of Object.keys(pinJson)) {
    if (key in mapping && key != mapping[key]) {
      pinJson[mapping[key]] = pinJson[key];
      delete pinJson[key];
    }
  }
}

export function updateSubgraphTags(subGraph: SubGraphJson, mapping: {[old: string]: string}) {
  for (let node of subGraph.nodes)
    if (node.tag in mapping) node.tag = mapping[node.tag];

  for (let link of subGraph.links) {
    updatePinTag(link[0], mapping);
    if (typeof link[1] === 'string') {
      if (link[1] in mapping) link[1] = mapping[link[1]];
    }
    else updatePinTag(link[1], mapping);
  }
}
