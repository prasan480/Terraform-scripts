(props) => {
  const { onSave, MUI, MUIIcons, provisionData, API_CONFIG, implName } = props;
  const { useState, useEffect } = React;
  
  const [provisionState, setProvisionState] = useState(provisionData);
  const [size, setSize] = useState([]);
  const [instanceTypes, setInstanceTypes] = useState([]);
  const [awsMachineImages, setAwsMachineImages] = useState([]);
  const [regions, setRegions] = useState([]);
  const [awsVpcs, setAwsVpcs] = useState([]);
  const [awsSubnetIds, setAwsSubnetIds] = useState([]);
  const [selectedSubnetIds, setSelectedSubnetIds] = useState([]);
  const [selectedAwsVpc, setSelectedAwsVpc] = useState([]);
  
  const getPropertiesByImpl = async (impl) => {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    try {
      const response = await fetch(
        `${API_CONFIG.GET_PROPERTIES_BY_IMPLEMENTATION_API}?implementation=${impl}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      if (response.status >= 400) {
        throw new Error("Something went wrong with the API");
      }
      return await response.json();
    } catch (e) {
      return [];
    }
  };
  
  useEffect(() => {
    if (implName) {
      async function getByImpl() {
        const response = await getPropertiesByImpl(implName);
        let ec2Shirts = response.find((res) => res.name === "size");
        setSize(ec2Shirts?.options);
        
        let instanceTypes = response.find((res) => res.name === "instanceType");
        setInstanceTypes(instanceTypes?.options);
        
        let awsImages = response.find((res) => res.name === "ami");
        setAwsMachineImages(awsImages?.options);

        let regions = response.find((res) => res.name === "region");
        setRegions(regions?.options);
        
        let awsvpcsArr = response.find((res) => res.name === "aws_vpc");
        setAwsVpcs(awsvpcsArr?.options);

        let awsSubnetIdsArr = response.find((res) => res.name === "aws_subnet_id");
        setAwsSubnetIds(awsSubnetIdsArr?.options);
      }
      getByImpl();
    }
  }, [implName]);

  const handleSubnetIdChange = (event, newValue) => {
		setSelectedSubnetIds(newValue);
		const updatedActivity = {
			...provisionState,
			aws_subnet_id: newValue ? newValue : [],
		};
		setProvisionState(updatedActivity);
		onSaveOfTabData(updatedActivity);
  }
  
  const handleInstanceTypeChange = (event, newValue) => {
		if (typeof newValue === 'string') {
			setSelectedAwsVpc(newValue);
		} else if (newValue && newValue?.inputValue) {
			// Create a new value from the user input
			setSelectedAwsVpc(newValue?.inputValue);
		} else {
			setSelectedAwsVpc(newValue);
		}
		const updatedActivity = {
			...provisionState,
			aws_vpc: newValue?.inputValue ? newValue?.inputValue : newValue,
		};
		setProvisionState(updatedActivity);
		onSaveOfTabData(updatedActivity);
	}
  
  const handleChange = (event) => {
    let updatedActivity = { ...provisionState };
    if (event.target.name === "aws_subnet_id") {
      updatedActivity[event.target.name] = [event.target.value];
    } else {
      updatedActivity[event.target.name] = event.target.value;
    }

    setProvisionState(updatedActivity);
    onSaveOfTabData(updatedActivity);
  };
  
  const onSaveOfTabData = (updatedActivity) => {
    const data = { ...updatedActivity };
    onSave(data);
  };
  
  const provisionSpecificJSX = () => {
    return (
      <div className="plugin-page-form">
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            label="Instance Name"
            type={"text"}
            name="application_name"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.application_name ?
                provisionState.application_name :
                ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            label="Instance Profile"
            type={"text"}
            name="instance_profile"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.instance_profile ?
                provisionState.instance_profile :
                ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            label="SAP SID"
            type={"text"}
            name="sap_sid"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.sap_sid ? provisionState.sap_sid : ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            label="Count"
            type={"text"}
            name="as_count"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.as_count ? provisionState.as_count : ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            label="User"
            type={"text"}
            name="user"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.user ? provisionState.user : ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            select
            label="Instance Type"
            name="instanceType"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.instanceType ? provisionState.instanceType : ""
            }
            onChange={handleChange}
          >
            {instanceTypes && instanceTypes.length
              ? instanceTypes.map((instanceType) => {
                return (
                  <MUI.MenuItem
                    disabled={instanceType.disable}
                    key={instanceType.label}
                    value={instanceType.value}
                  >
                    {instanceType.label}
                  </MUI.MenuItem>
                );
              }) : []}
          </MUI.TextField>
        </div>
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            select
            label="AMI"
            name="ami"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.ami ? provisionState.ami : ""
            }
            onChange={handleChange}
          >
            {awsMachineImages && awsMachineImages.length
              ? awsMachineImages.map((awsMachineImage) => {
                return (
                  <MUI.MenuItem
                    disabled={awsMachineImage.disable}
                    key={awsMachineImage.label}
                    value={awsMachineImage.value}
                  >
                    {awsMachineImage.label}
                  </MUI.MenuItem>
                );
              }) : []}
          </MUI.TextField>
        </div>

        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            label="SAP Id"
            type={"text"}
            name="sap_id"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.sap_id ? provisionState.sap_id : ""
            }
            onChange={handleChange}
          />
        </div>
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            select
            label="Region"
            name="region"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.region ? provisionState.region : ""
            }
            onChange={handleChange}
          >
            {regions && regions.length
              ? regions.map((region) => {
                return (
                  <MUI.MenuItem
                    disabled={region.disable}
                    key={region.label}
                    value={region.value}
                  >
                    {region.label}
                  </MUI.MenuItem>
                );
              }) : []}
          </MUI.TextField>
        </div>
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            select
            label="AWS VPC"
            name="aws_vpc"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.aws_vpc ? provisionState.aws_vpc : ""
            }
            onChange={handleChange}
          >
            {awsVpcs && awsVpcs.length
              ? awsVpcs.map((awsVpc) => {
                return (
                  <MUI.MenuItem
                    disabled={awsVpc.disable}
                    key={awsVpc.label}
                    value={awsVpc.value}
                  >
                    {awsVpc.label}
                  </MUI.MenuItem>
                );
              }) : []}
          </MUI.TextField>
        </div>
        <div className="plugin-input-area">
          <MUI.TextField
            fullWidth
            select
            label="AWS Subnet Id"
            name="aws_subnet_id"
            InputLabelProps={{shrink: true}}
            value={
              provisionState.aws_subnet_id &&
              provisionState.aws_subnet_id.length
                ? provisionState.aws_subnet_id[0]
                : ""
            }
            onChange={handleChange}
          >
            {awsSubnetIds && awsSubnetIds.length
              ? awsSubnetIds.map((awsSubnetId) => {
                return (
                  <MUI.MenuItem
                    disabled={awsSubnetId.disable}
                    key={awsSubnetId.label}
                    value={awsSubnetId.value}
                  >
                    {awsSubnetId.label}
                  </MUI.MenuItem>
                );
              }) : []}
          </MUI.TextField>
        </div>
      </div>
    );
  };
  
  /***** Do not edit anything below this line *****/
  
  return <div>{provisionSpecificJSX()}</div>;
};
