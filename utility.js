var schemaJson = {};
var portfolioItemTypes = [];
var scheduleStates = []; 

const loadSchema = () => {
    var schemaUrl = `${$RallyContext.Url.origin}/slm/schema/v2.0/workspace/${$RallyContext.GlobalScope.Workspace.OID}?pageSize=2000`;
    return fetch(schemaUrl)
    .then(response => response.json())
    .then(schema => {
        scheduleStates = getScheduleStates(schema);
        portfolioItemTypes = getPortfolioItemTypeDefinitions(schema);
    });
}

const getScheduleStates = (schema) => {
    return getAllowedValues(schema,"SchedulableArtifact","ScheduleState","StringValue");
}

const getPortfolioItemTypeDefinitions = (schema) => {
    var portfolioItemTypes =  schema && schema.QueryResult && schema.QueryResult.Results && schema.QueryResult.Results
        .reduce((types,t) => {
            if (t.TypePath.includes('PortfolioItem/')){
                types.push(t);
            }            
            return types;
        },[]) || null;
    return portfolioItemTypes;
}

const getAllowedValues = (schema, typeDef, fieldName, fieldAttribute) => {
    var allowedValues =  schema && schema.QueryResult && schema.QueryResult.Results && 
    schema.QueryResult.Results.find((type) => type.TypePath == typeDef).Attributes
        .find((attr) => attr.ElementName == fieldName).AllowedValues
        .reduce((vals,v) => {
            if (fieldAttribute){
                vals.push(v[fieldAttribute]);
            } else {
                vals.push(v);
            }
            return vals;
        },[]) || null;
    return allowedValues;
}

const loadCapacityByProjectFromCapacityPlan = (capacityPlanName) => {
    const capacityPlanQuery = `(CapacityPlan.Name = "${capacityPlanName}")`;
    const capacityPlanFetch = "PlannedCapacityPoints,Project,Name,CapacityPlan"; //todo, do we also get count? 
    var cpUrl = `${$RallyContext.Url.origin}/slm/webservice/v2.0/capacityplanproject?workspace=${$RallyContext.GlobalScope.Workspace._ref}&project=${$RallyContext.GlobalScope.Project._ref}&query=${capacityPlanQuery}&fetch=${capacityPlanFetch}`
    return fetch(cpUrl)
        .then(response => response.json())
        .then(results => {
            var capacityPlanProjects = results.QueryResult.Results
            .reduce((cppBreakdown,cpp) => {
                if (cpp._objectVersion != 0){
                    cppBreakdown[cpp.Project.Name] = cpp.PlannedCapacityPoints;
                }
                return cppBreakdown;
            },{});
            return capacityPlanProjects
        })
}

 const getCapacityByProjectFromRelease = (releaseName) => {
//TODO
 }   