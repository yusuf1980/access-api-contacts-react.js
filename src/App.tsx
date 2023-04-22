// import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
// import Badge from '@mui/material/Badge';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
// import Search from '@mui/icons-material/Search';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { getContacts, refreshToken } from './api/axios';

const drawerWidth = 350;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  name: string,
) {
  return { name };
}

interface ItemTag  {
  name: string;
}
let arr:string[] = []

const itemTag = (tg: ItemTag[]) => {
  tg.forEach((item)=>{
      if(!arr.includes(item.name)) {
        arr.push(item.name)
      }
  })
  
  return arr
}

function App() {
  const [contacts, setContacts] = useState([{id:'',name:'',phoneNumber:'', tags:[]}])
  const [tag, setTag] = useState([{tags: []}])
  const [itemTags, setItemTags] = useState([''])
  const [includeTags, setIncludeTags] = useState([''])
  const [loading, setLoading] = useState(false)
  const [nextPage, setNextPage] = useState('')
  const [allFilter, setFilter] = useState({'minMessagesSent': 0, 'minMessagesRecv': 0, 'maxMessagesSent': 0, 'maxMessagesRecv': 0})

  let fetching:boolean = false
  
  useEffect(() => {
    setLoading(true)
    getContacts()
      .then(res => {
        setNextPage(res.nextPage)
        setContacts(res.contacts)
        setTag(res.contacts)
      })
      .catch(err=> {
        console.log(err.response.data)
        setRefreshToken(err.response.data)
      })
      return
  }, [])

  const setRefreshToken = (data:any) => {
    if((data.message === 'jwt expired'|| 
    data.message === 'jwt malformed' || 
    data.message === "No token") 
    && data.statusCode===401) {
      refreshToken()
        .then(res=>{
          console.log(res)
        })
        .catch(er=> {
          console.log(er)
        })
    }
  }

  const filter = (name:string, val:any=0, next:boolean=false) => {
    if(name == 'minMessagesRecv') {
      if(val!=='') {
        allFilter.minMessagesRecv = parseInt(val)
      }
      else {
        allFilter.minMessagesRecv = 0;
      }
    }
    else if(name == 'minMessagesSent') {
      if(val!=='') {
        allFilter.minMessagesSent = parseInt(val)
      }
      else {
        allFilter.minMessagesSent = 0;
      }
    }
    else if(name == 'maxMessagesSent') {
      if(val!=='') {
        allFilter.maxMessagesSent = parseInt(val)
      }
      else {
        allFilter.maxMessagesSent = 0;
      }
    }
    else if(name == 'maxMessagesRecv') {
      if(val!=='') {
        allFilter.maxMessagesRecv = parseInt(val)
      }
      else {
        allFilter.maxMessagesRecv = 0;
      }
    }
    
    let q:string = ''
    if(name == 'search') {
      if(val!=='') {
        q = val
      }
    }
    let np:string = ''
    if(name=="nextpage") {
        np = val
    }
    
    getContacts(np, allFilter.minMessagesSent, allFilter.minMessagesRecv, allFilter.maxMessagesSent, allFilter.maxMessagesRecv, q)
      .then(res=> {
        setNextPage(res.nextPage)
        if(next) setContacts(old=>[...old, ...res.contacts])
        else setContacts(res.contacts)
      })
      .catch(err=> {
        setRefreshToken(err.response.data)
      })
  }

  const ChangeField = (name:string, val:any=0) => {
    filter(name, val)
  }

  useEffect(() => {
    interface itTag {
      tags: any[];
    }
      if(itemTags.length ===1 && itemTags[0] === '') {
        itemTags.splice(0, 1)
      }
      
      tag.forEach((item:itTag, i)=>{
        item.tags.forEach(t=> {
          if(!itemTags.includes(t.name)) { 
            return setItemTags(old=>[...old, t.name])
          }
        })
      })
  }, [tag])
  
  useEffect(() => {
    const onScroll = (e:any) => {
      const { scrollHeight, scrollTop, clientHeight } = 
      e.target.scrollingElement;

      if(!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetching = true
        // nextPa()
      }
    }

    document.addEventListener("scroll", onScroll)
    return () => {
      document.removeEventListener("scroll", onScroll)
    }
  }, [itemTags])

  useEffect(() => {
    if(itemTags.length > 1) {
      setIncludeTags(itemTags)      
    } 
  }, [])

  const contactList = contacts.map((cont, i) => {
    const labelId:string = `checkbox-list-label-${cont.id}`;
    interface tagD {
      name:string;
    }
    return (
    <ListItem 
    key={i}
    secondaryAction={
      <div aria-label="comments">
        {cont.tags.map((tag:tagD) => (
        <IconButton color='secondary' style={{fontSize: "16px", marginRight:""}}>{tag.name} | </IconButton> ))}
      </div>
    }
    disablePadding
    >
      <ListItemIcon>
        <Checkbox
        edge="start"
        tabIndex={-1}
        disableRipple
        inputProps={{ 'aria-labelledby': labelId }}
        />
      </ListItemIcon>
      <ListItemAvatar>
        <Avatar>
          <ImageIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={cont.name} secondary={cont.phoneNumber} />
    </ListItem>
  )})
  
  const delInclude = (index:number) => {
    console.log(index)
    includeTags.splice(index, 1)
  }
  interface incl {
    row:string;
    isInclude:boolean;
  }

  const CheckIncludes = (row:string, isInclude:boolean) => {
    if(includeTags.includes(row)) {
       return <StyledTableCell component="th" scope="row">
              <Badge color="primary">
                <CheckCircleIcon color="primary" />
              </Badge>
              </StyledTableCell>
    }
    return <StyledTableCell component="th" scope="row"></StyledTableCell>
  }

  const tagContactList = itemTags.map((row, i) => (
    <StyledTableRow key={i} onClick={e=>{delInclude(i)}}>
      <StyledTableCell component="th" scope="row">
        {row}
      </StyledTableCell>
      {CheckIncludes(row, true)}
    </StyledTableRow>
  ))
  
  const buttonNext = () => {
      if(nextPage !== undefined) {
        return (<Button onClick={(e) => {filter('nextpage', nextPage, true)}}>More Contacts</Button>)
      }
      return (<div></div>)
  } 

  const searchChange = (val:string) => {
    setTimeout(() => {
      filter('search', val)
    }, 500)
      
  }

  const searchField = () => (
    <TextField 
    onChange={e=>{searchChange(e.target.value)}}
    fullWidth
    label="Search Contact" 
    id="fullWidth"
    />
  )

  let tagPage;

  tagPage = tagContactList

  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar  style={{minHeight: "50px"}}>
          <Typography variant="h6" noWrap component="div">
            Contacts ({contacts.length})
          </Typography>
          <div>
            <Button sx={{position: 'absolute', right: '10px', top: '10px'}} color="secondary" variant="contained" size="small">
              <AddIcon />
            </Button>
          </div>
        </Toolbar>
          
        </AppBar>
        <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
        
      >
        <h3 style={{}}>Audience</h3>
        <Divider />
        <TableContainer component={Paper}>
          <h4 style={{marginBottom: "0px"}}>Include Tag</h4>
          <Table size="small" aria-label="customized table">
            <TableBody>
              {tagPage} 
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <TableContainer component={Paper}>
          <h4 style={{marginBottom: "0px"}}>Exclude Tag</h4>
          <Table size="small" aria-label="customized table">
            <TableBody>
            {tagPage}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <h4>Message Sent:</h4>
        <Grid container>
          <Grid item xs={6}> 
            <TextField type="number" onChange={(e) => {ChangeField('minMessagesSent', e.target.value)}} id="outlined-basic" label="Min" variant="outlined" size="small" placeholder='Min' />
          </Grid>
          <Grid item xs={6}>
            <TextField type="number" onChange={(e) => {ChangeField('maxMessagesSent', e.target.value)}} id="filled-basic" label="Max" variant="outlined" size="small" placeholder="Max" />
          </Grid>
      </Grid>
        <h4>Message Receive:</h4>
        <Grid container>
          <Grid item xs={6}> 
            <TextField type="number" onChange={(e) => {ChangeField('minMessagesRecv', e.target.value)}} id="outlined-basic" label="Min" variant="outlined" size="small" placeholder='Min' />
          </Grid>
          <Grid item xs={6}>
            <TextField type="number" onChange={(e) => {ChangeField('maxMessagesRecv', e.target.value)}} id="filled-basic" label="Max" variant="outlined" size="small" placeholder="Max" />
          </Grid>
      </Grid>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          {searchField()}
          </Box>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {contactList}
            {buttonNext()}
          </List>
      </Box>
      </Box>
    </div>
  );
}

export default App;
