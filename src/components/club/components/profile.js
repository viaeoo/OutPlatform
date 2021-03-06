import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import  { withRouter } from 'react-router-dom';

import { fetchUpdateClub } from 'actions/club';

import { subStringLimitStringLength } from 'helper/common';

import FindCollege from 'components/register/components/findCollege';

class Profile extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      findCollegeToggle : false,
      isEditToggle: false,
      emptyValue: '아직 등록되지 않았습니다',
    }

    this.editToggle = this.editToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleSnsTransition = this.handleSnsTransition.bind(this);

    this.snippetLimitStringLength = this.snippetLimitStringLength.bind(this);

    this.isFindCollegeToggle = this.isFindCollegeToggle.bind(this);
    this.setCollegeName = this.setCollegeName.bind(this);

    this.handleEmptyValue = this.handleEmptyValue.bind(this);
  }

  handleEmptyValue(val) {
    if(val) {
      return val;
    }
    return this.state.emptyValue;
  }

  setCollegeName(value) {
    this.refs.club_college.value = value;
  }

  isFindCollegeToggle() {
    this.setState({
      findCollegeToggle: !this.state.findCollegeToggle,
    });
  }

  editToggle() {
    this.setState({
      isEditToggle: !this.state.isEditToggle,
    });
  }

  snippetLimitStringLength(e) {
    const target = e.target.id;
    const error = document.getElementById(`${target}_error`);
    const isValid = subStringLimitStringLength(target, 200);

    if(!isValid){
      // 허용되는 바이트까지 자르기
      error.innerHTML = '200자가 넘었습니다!';
      error.className = 'warning-color';

    } else {
      error.innerHTML = '최대 200글자까지 허용됩니다.';
      error.className = '';
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const data = {
      club_college: this.refs.club_college.value,
      cate_id : this.refs.cate_id.value,
      tag_id : this.refs.tag_id.value,
      club_ex : this.refs.club_ex.value,
    }

    this.props.fetchUpdateClub(this.props.club_id, data);
    this.editToggle();
  }

  handleSnsTransition = (url) => (e) => {
    //URL CHECK
    const prefix = 'http://';
    if(url.toLowerCase().indexOf(prefix) === -1){
      url = ''.concat(prefix, url);
    }

    window.location.href = url;
  }

  render() {
    const findCollegePopup = this.state.findCollegeToggle ? <FindCollege close={this.isFindCollegeToggle} setCollegeName={this.setCollegeName} /> : '';

    let editButton;
    let viewContents = !this.props.club_ex ? '' : this.props.club_ex.split('\n').map((line, key) => {
      return (<span key={key}>{line}<br /></span>);
    });
    // let viewSNS;

    let editInputText = (id, placeholder) => {
      switch(id){
        case 'club_college':
          return (
            <input type='text' onFocus={this.isFindCollegeToggle} defaultValue={this.props.club_college} ref={id} />
          );
        case 'cate_id':
          return (
            <select defaultValue={this.props.cate_id} ref={id}>
              {this.props.category.data.map((item, key) => {
                return (<option value={item.cate_id} key={key}>{item.cate_name}</option>);
              })}
            </select>
          );
        case 'tag_id':
          return (
            <select defaultValue={this.props.tag_id} ref={id}>
              {this.props.tag.data.map((item, key) => {
                return (<option value={item.tag_id} key={key}>#{item.tag_name}</option>);
              })}
            </select>
          );
        case 'club_ex':
          return (
            <span>
              <span id='club_ex_limitation' className='club-ex-limitation'>0/200</span>
              <textarea ref={id} id='club_ex' onChange={this.snippetLimitStringLength} placeholder={placeholder} defaultValue={this.props.club_ex}></textarea>
              <a className='club-ex-error' id='club_ex_error'>최대 200글자까지 허용됩니다.</a>
            </span>
          );
        case 'sns':
          return (
            <span className='sns'>
              <i className={`sns-basic-icon facebook`}></i>
            </span>
          );
        default:
          return false;
      }
    }

    //수정 버튼 Toggle
    if(this.props.myPage && !this.state.isEditToggle){
      editButton = (
        <div className='edit-btn'>
          <button className='emerald-btn' onClick={this.editToggle}>수정</button>
        </div>
      );
    } else if(this.state.isEditToggle) {
      editButton = (
        <div className='edit-btn'>
          <button className='gray-btn' onClick={this.editToggle}>취소</button>
          <button className='emerald-btn' onClick={this.handleSubmit}>확인</button>
        </div>
      );
    } else {
      editButton = '';
    }

    // viewSNS = (
    //   <span className='sns'>
    //     {this.props.sns.map((item, key) => {
    //       return (
    //         <i key={key} id={item.sns_name} onClick={this.handleSnsTransition(item.sns_url)} className={`sns-basic-icon ${item.sns_name}`}></i>
    //       );
    //     })}
    //   </span>
    // );

    return(
      <div className='profile-container'>
        <div className='container'>
          {editButton}
          <div className='profile-inner'>
            <div className='title-wrapper'>
              <span></span>
              <h3>단체 프로필</h3>
            </div>
            <div className='profile-inner-left'>
              <ul>
                {/* <li>
                  <h5>소속학교</h5>
                  <p>{this.state.isEditToggle ? editInputText('club_college') : this.handleEmptyValue(this.props.club_college)}</p>
                </li> */}
                <li>
                  <h5>단체종류</h5>
                  <p>{this.state.isEditToggle ? editInputText('cate_id') : this.handleEmptyValue(this.props.cate_name)}</p>
                </li>
                <li>
                  <h5>태그</h5>
                  {this.state.isEditToggle ? <p>{editInputText('tag_id')}</p> : this.props.tag_name ? <span className='tag'>{`#${this.props.tag_name}`}</span> : this.handleEmptyValue(this.props.tag_name)}
                </li>
              </ul>
            </div>
            <div className='profile-inner-right'>
              <ul>
                <li>
                  <h5>단체소개</h5>
                  <div className='club-ex'>
                    {this.state.isEditToggle ? editInputText('club_ex', '우리 단체에 대한 소개를 올려주세요!') : this.handleEmptyValue(viewContents)}
                  </div>
                </li>
                {/* <li>
                  <h5>SNS</h5>
                  <p>{this.state.isEditToggle ? editInputText('sns') : viewSNS}</p>
                </li> */}
              </ul>
            </div>
          </div>
          {findCollegePopup}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    category: state.category,
    tag: state.tag,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUpdateClub : (club_id, data) => {
      dispatch(fetchUpdateClub(club_id, data));
    }
  }
}

Profile.propTypes = {
  myPage: PropTypes.bool,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
