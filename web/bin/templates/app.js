angular.module('templates.app', ['comment/comment.tpl.html', 'comment/replies.tpl.html', 'comment/submitActions.tpl.html', 'comment/taskActions.tpl.html', 'events/calendar.tpl.html', 'events/eventDetails.tpl.html', 'events/events.tpl.html', 'login/login.tpl.html', 'login/signup.tpl.html', 'nav/nav.tpl.html', 'post/post.tpl.html', 'richtext/richtext.tpl.html', 'richtext/richtextCard.tpl.html', 'school/appSchool.tpl.html', 'school/class/classEdit.tpl.html', 'school/pdfview.tpl.html', 'school/school.tpl.html', 'school/schoolEdit.tpl.html', 'school/users/classUser.tpl.html', 'school/users/classUsers.tpl.html', 'shared/app.tpl.html', 'shared/apph.tpl.html', 'shared/apptop.tpl.html', 'shared/gallery.tpl.html', 'shared/gmap.tpl.html', 'user/directive/userCard.tpl.html', 'user/userEdit.tpl.html', 'userList/userList.tpl.html', 'wall/wall.tpl.html']);

angular.module("comment/comment.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("comment/comment.tpl.html",
    "<div class=\"comment media\" ng-cloak style=\"width: 100%\">\n" +
    "	<a href=\"#\" class=\"media-left\">\n" +
    "		<img alt=\"image\" class=\"avatar avatar-lg\" src=\"assets/images/avatar-1-small.jpg\" >\n" +
    "	</a>\n" +
    "	<div class=\"media-body \">\n" +
    "		<div class=\"comment-body\">\n" +
    "			<a href=\"#\" class=\"comment-author\">{{vm.name}}</a> \n" +
    "\n" +
    "			<span ng-if=\"!vm.isreply\">\n" +
    "				<span ng-if=\"msg.type != 'Reply'\" style=\"margin: 0px 5px;\"> on&nbsp;<span class=\"text-azure\">{{vm.classnames | listToString}}</span> </span>\n" +
    "				\n" +
    "				<div class=\"comment-meta\">\n" +
    "					<span class=\"label\" \n" +
    "						ng-class=\"{'label-primary' : ['Message', 'Discussion', 'Blog'].indexOf(msg.type) >= 0 , 'label-danger' : ['Assignment', 'Task'].indexOf(msg.type) >= 0 , 'label-warning' :['Notification', 'Newsletter',  'Assessment'].indexOf(msg.type) >= 0 , 'label-info' :['Material'].indexOf(msg.type) >= 0 }\" \n" +
    "						ng-if=\"msg.type != 'Reply'\">\n" +
    "						{{msg.type}}\n" +
    "					</span>	\n" +
    "					<span class=\"label label-info margin-left-10\" ng-if=\"msg.dueby\">\n" +
    "						Due {{vm.duein}}\n" +
    "					</span>\n" +
    "				</div>\n" +
    "			</span>\n" +
    "			<span class=\"date\" style=\"padding-left: 10px;\"> {{vm.posted}}</span>\n" +
    "\n" +
    "			<div class=\"comment-header-actions\" >\n" +
    "				<button class=\"btn btn-pure btn-success icon fa-bookmark-o \" ></button>\n" +
    "				<button class=\"btn btn-pure btn-success icon fa-star-o\" ></button>\n" +
    "			</div>\n" +
    "\n" +
    "			<comment-editor id=\"react\" content=\"msg.text\" readonly=\"true\" class=\"comment-content\"> </comment-editor>\n" +
    "\n" +
    "            <richtext-card rtpost=\"msg\" ng-if=\"vm.hasRichtext\" ng-click=\"vm.openRichtext()\"/>\n" +
    "            \n" +
    "			<div gallery files=\"msg.files\" readonly=\"true\" ng-if=\"msg.files && msg.files.length > 0\"></div>\n" +
    "\n" +
    "			<div class=\"comment-actions\">\n" +
    "\n" +
    "				<div ng-if=\"!vm.showSubmitActions &&  !vm.showTaskActions\">\n" +
    "					\n" +
    "					<button class=\"btn btn-default btn-sm btn-round btn-outline \" ng-click=\"showPost('reply')\" style=\"height: 30px;\"><i class=\"icon fa-reply\" aria-hidden=\"true\"></i>Reply</button>\n" +
    "\n" +
    "				</div>\n" +
    "\n" +
    "				<submit-actions msg=\"msg\" ng-if=\"vm.showSubmitActions\" show-replies=\"showReplies(type)\" show-post=\"showPost(type)\"/>\n" +
    "				<task-actions msg=\"msg\" ng-if=\"vm.showTaskActions\" show-replies=\"showReplies(type)\" show-post=\"showPost(type)\"/>\n" +
    "				\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"comment-reply\" ng-if=\"vm.postType ==='reply'\" >\n" +
    "				<post parent=\"msg.parent || msg\" response-type=\"{{msg.responseType || 'reply'}}\" placeholder=\"Enter question/response..\"></post>\n" +
    "			</div>\n" +
    "\n" +
    "			\n" +
    "			<div class=\"comment-reply\" ng-if=\"vm.postType === 'submission' \" >\n" +
    "				<post parent=\"msg.parent || msg\" response-type=\"{{msg.responseType || 'submission'}}\" placeholder=\"Submit assignment..\"></post>\n" +
    "			</div>\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"comments\" ng-if=\"msg.replies && msg.replies.length > 0\">\n" +
    "			<replies comments=\"vm.selectedReplies\"></replies>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "    <!-- Comments-->\n" +
    "    \n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("comment/replies.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("comment/replies.tpl.html",
    "<div ng-if=\"vm.showFew\" style=\"text-align: right\">\n" +
    "	<small>Showing {{vm.visibleReplies.length}} of {{vm.total}} <a href=\"#\" ng-click=\"vm.showAll()\" style=\"margin-left: 20px;\">Show all</a></small>\n" +
    "</div>\n" +
    "<div ng-if=\"!vm.showFew\" style=\"text-align: right\">\n" +
    "	<small> {{vm.total}} responses</small>\n" +
    "</div>\n" +
    "\n" +
    "<comment msg=\"reply\" ng-repeat=\"reply in vm.visibleReplies\"></comment>");
}]);

angular.module("comment/submitActions.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("comment/submitActions.tpl.html",
    "<!-- visible only for trainers-->\n" +
    "<button class=\"btn btn-default btn-sm btn-round btn-success\" ng-class=\"vm.showReplyType==='submission'?'':' btn-outline'\" ng-click=\"vm.showReplies('submission')\"  style=\"height: 30px;\">Submissions ({{vm.submissionsCount}})</button> \n" +
    "\n" +
    "<!-- visible only for students-->\n" +
    "<button class=\"btn btn-default btn-sm btn-round btn-outline \" ng-click=\"vm.showPost('submission')\" style=\"height: 30px;\"><i class=\"icon fa-reply\" aria-hidden=\"true\"></i>Submit</button>\n" +
    "\n" +
    "<!-- visible only for trainers & students-->\n" +
    "\n" +
    "<button class=\"btn btn-default btn-sm btn-round btn-info btn-outline \" ng-class=\"vm.showReplyType ==='reply'?'':' btn-outline'\"  ng-click=\"vm.showReplies('reply')\" style=\"height: 30px; margin-left: 20px;\">Q&amp;A ({{vm.qaCount}})</button>\n" +
    "\n" +
    "<button class=\"btn btn-default btn-sm btn-round btn-outline \" ng-click=\"vm.showPost('reply')\"  style=\"height: 30px;\"><i class=\"icon fa-reply\" aria-hidden=\"true\"></i>Ask Question?</button>\n" +
    "\n" +
    "<!-- visible only for trainers-->\n" +
    "<button class=\"btn btn-default btn-sm btn-round btn-outline btn-warning\"   style=\"height: 30px; margin-left: 20px;\">Pending (10)</button> ");
}]);

angular.module("comment/taskActions.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("comment/taskActions.tpl.html",
    "<!-- visible only for trainers-->\n" +
    "<button class=\"btn btn-default btn-sm btn-round btn-success\" ng-class=\"vm.showReplyType==='submission'?'':' btn-outline'\" ng-click=\"vm.showReplies('submission')\"  style=\"height: 30px;\">Completed ({{vm.submissionsCount}})</button> \n" +
    "\n" +
    "<!-- visible only for students-->\n" +
    "<button class=\"btn btn-primary btn-sm btn-round btn-raised \" ng-click=\"vm.onComplete()\" style=\"height: 30px;\" ng-if=\"!vm.userHasCompletedTask\"><i class=\"icon fa-check\" aria-hidden=\"true\"></i>I have completed</button>\n" +
    "<button class=\"btn btn-success btn-sm btn-round btn-raised \" style=\"height: 30px;\" ng-if=\"vm.userHasCompletedTask\" ng-disabled=\"vm.userHasCompletedTask\"><i class=\"icon fa-check\" aria-hidden=\"true\"></i>Completed</button>\n" +
    "\n" +
    "<!-- visible only for trainers & students-->\n" +
    "\n" +
    "<button class=\"btn btn-default btn-sm btn-round btn-info btn-outline \" ng-class=\"vm.showReplyType ==='reply'?'':' btn-outline'\"  ng-click=\"vm.showReplies('reply')\" style=\"height: 30px; margin-left: 20px;\">Q&amp;A ({{vm.qaCount}})</button>\n" +
    "\n" +
    "<button class=\"btn btn-default btn-sm btn-round btn-outline \" ng-click=\"vm.showPost('reply')\"  style=\"height: 30px;\"><i class=\"icon fa-reply\" aria-hidden=\"true\"></i>Ask Question?</button>\n" +
    "\n" +
    "<!-- visible only for trainers-->\n" +
    "<button class=\"btn btn-default btn-sm btn-round btn-outline btn-warning\"   style=\"height: 30px; margin-left: 20px;\">Pending (10)</button> ");
}]);

angular.module("events/calendar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("events/calendar.tpl.html",
    "");
}]);

angular.module("events/eventDetails.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("events/eventDetails.tpl.html",
    "<form class=\"modal-content\" name=\"Form\" id=\"form\" novalidate ng-submit=\"vm.form.submit(Form)\" >\n" +
    "\n" +
    "  <div class=\"modal-header\">\n" +
    "      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" ng-click=\"vm.cancel()\">\n" +
    "        <span aria-hidden=\"true\">×</span>\n" +
    "      </button>\n" +
    "      <h4 class=\"modal-title\">Event</h4>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-body\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"title\" class=\"control-label\">Title</label>\n" +
    "      <input type=\"text\" id=\"title\" class=\"form-control\" placeholder=\"Title\" ng-model=\"vm.event.title\" required>\n" +
    "      <span class=\"error text-small block\" ng-if=\"Form.title.$dirty && Form.title.$error.required\">Title is required.</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "     <label for=\"message\" class=\"control-label\">Message</label>\n" +
    "      <textarea id=\"message\" name=\"message\" class=\"form-control\" rows=\"3\" placeholder=\"Type your message\" ng-model=\"vm.event.details\" required></textarea>\n" +
    "      <span class=\"error text-small block\" ng-if=\"Form.message.$dirty && Form.message.$error.required\">Message is required.</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"checkbox checkbox-primary\">\n" +
    "            <label class=\"control-label\">\n" +
    "              <input type=\"checkbox\" ng-model=\"vm.event.isAllDay\" ng-click=\"vm.setAllday(vm.event.isAllDay)\">\n" +
    "              All Day\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "      \n" +
    "\n" +
    "    <!-- <div class=\"col-md-6\" style=\"padding-left: 0px;\"> -->\n" +
    "      <div class=\"form-group\">\n" +
    "          <label class=\"control-label\">From</label>\n" +
    "          <div>\n" +
    "             <div class=\"input-group\" style=\"float: left; width: 200px;\">\n" +
    "                  <span class=\"input-group-addon\">\n" +
    "                    <i class=\"icon wb-calendar\" aria-hidden=\"true\"></i>\n" +
    "                  </span>\n" +
    "                  <input type=\"text\" id=\"startDate\" class=\"form-control\" datepicker ng-model=\"vm.event.startDate\" ng-change=\"vm.onStartDateChange()\">\n" +
    "              </div>\n" +
    "              <div class=\"input-group\" style=\"width: 150px;\">\n" +
    "                  <span class=\"input-group-addon\">\n" +
    "                    <i class=\"icon wb-time\" aria-hidden=\"true\"></i>\n" +
    "                  </span>\n" +
    "                  <input type=\"text\" class=\"form-control ui-timepicker-input\" timepicker ng-model=\"vm.event.startTime\" ng-disabled=\"vm.event.isAllDay\" ng-change=\"vm.onStartTimeChange()\">\n" +
    "              </div>\n" +
    "          </div>\n" +
    "      </div>\n" +
    "   <!--  </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\"> -->\n" +
    "      <div class=\"form-group\">\n" +
    "          <label class=\"control-label\">To</label>\n" +
    "          <div>\n" +
    "             <div class=\"input-group\" style=\"float: left; width: 200px;\">\n" +
    "                  <span class=\"input-group-addon\">\n" +
    "                    <i class=\"icon wb-calendar\" aria-hidden=\"true\"></i>\n" +
    "                  </span>\n" +
    "                  <input type=\"text\" class=\"form-control datepair-date datepair-end\" datepicker ng-model=\"vm.event.endDate\" start-date=\"vm.event.startDate\" ng-change=\"vm.onEndDateChange()\">\n" +
    "              </div>\n" +
    "              <div class=\"input-group\" style=\"width: 150px; \"   >\n" +
    "                  <span class=\"input-group-addon\">\n" +
    "                    <i class=\"icon wb-time\" aria-hidden=\"true\"></i>\n" +
    "                  </span>\n" +
    "                  <input type=\"text\" class=\"form-control datepair-time datepair-end ui-timepicker-input\" timepicker ng-model=\"vm.event.endTime\" start-time=\"vm.event.startTime\"  ng-disabled=\"vm.event.isAllDay\" ng-change=\"vm.onEndTimeChange()\">\n" +
    "              </div>\n" +
    "          </div>\n" +
    "      </div>\n" +
    "    <!-- </div> -->\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">\n" +
    "           Repeat \n" +
    "        </label>\n" +
    "        <div class=\"btn-group dropdown\" style=\"margin-left: 10px;\">\n" +
    "          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">\n" +
    "            {{vm.event.repeat}}\n" +
    "            <span class=\"caret\"></span>\n" +
    "          </a>\n" +
    "          <ul class=\"dropdown-menu bullet\" aria-labelledby=\"exampleBulletDropdown1\" role=\"menu\">\n" +
    "            <li role=\"presentation\"><a href=\"javascript:void(0)\" role=\"menuitem\" ng-repeat=\"v in ['daily', 'weekly', 'monthly', 'none']\" ng-click=\"vm.setFrequency(v)\">{{v}}</a></li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"checkbox checkbox-primary animate-if\" style=\"display: inline-block; margin: 0px; padding: 0px 0px 0px 10px;\" ng-if=\"vm.event.repeat != 'none'\">\n" +
    "            <label>\n" +
    "              <input type=\"checkbox\" ng-model=\"vm.event.isCustom\" ng-click=\"vm.selectCustom()\">\n" +
    "              Custom\n" +
    "            </label>\n" +
    "        </div>\n" +
    "\n" +
    "        <span style=\"margin-left: 20px;\">{{vm.repeatText}}</span>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div class=\"col-md-12 form-group\" uib-collapse=\"!vm.event.isCustom\" style=\"border: 1px solid #eae6e6; border-radius: 5px; padding: 10px;\">\n" +
    "\n" +
    "      <div ng-if=\"vm.event.repeat === 'daily'\" class=\"animate-if\">\n" +
    "        Every <input type=\"number\" class=\"form-control\" style=\"width: 70px; display: inline;\" ng-model=\"vm.event.daily.every\"/> day(s).\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-if=\"vm.event.repeat === 'weekly'\" class=\"animate-if\">\n" +
    "        Every <input type=\"number\" class=\"form-control\" style=\"width: 70px; display: inline;\" ng-model=\"vm.event.weekly.every\"/> week(s) on <br/>\n" +
    "        <div class=\"btn-group\" aria-label=\"Basic example\" role=\"group\" style=\"margin-top: 10px\"> \n" +
    "          <button type=\"button\" \n" +
    "              style=\"margin-right: 2px;\" \n" +
    "              ng-class=\" vm.isWeekDaySelected(w.value)? 'btn-raised btn-info' : ''\"\n" +
    "              ng-click=\"vm.selectWeekDay(w.value)\"\n" +
    "              class=\"btn btn-default \" \n" +
    "              ng-repeat=\"w in [{label: 'M', value: 1 }, {label: 'T', value: 2 },{label: 'W', value: 3 },{label: 'T', value: 4 },{label: 'F', value: 5 }, {label: 'S', value: 6 }, {label: 'S', value: 0 },] track by $index\">{{w.label}}</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-if=\"vm.event.repeat === 'monthly'\" class=\"animate-if\">\n" +
    "        Every <input type=\"number\" class=\"form-control\" style=\"width: 70px; display: inline;\" ng-model=\"vm.event.monthly.every\" /> month(s) on <br/>\n" +
    "        \n" +
    "        <div class=\"col-md-6\">\n" +
    "          <div class=\"checkbox checkbox-primary\">\n" +
    "              <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"vm.event.monthly.iseach\" ng-click=\"vm.selectMonthlyEach()\">\n" +
    "                Each\n" +
    "              </label>\n" +
    "          </div>\n" +
    "          <div class=\"btn-group\" aria-label=\"Basic example\" role=\"group\" style=\"margin-top: 10px; width: 264px;\"> \n" +
    "            <button type=\"button\" \n" +
    "                ng-disabled=\"vm.event.monthly.isonthe\"\n" +
    "                style=\"padding: 6px; width: 35px; margin-right: 2px; margin-bottom: 2px\" \n" +
    "                class=\"btn btn-default \" \n" +
    "                ng-class=\" vm.isMonthDaySelected($index+1)? 'btn-raised btn-info' : ''\"\n" +
    "               ng-click=\"vm.selectMonthDay($index+1)\"\n" +
    "                ng-repeat=\"w in vm.monthDays track by $index\">{{$index+1}}</button>\n" +
    "          </div> \n" +
    "        </div>\n" +
    "        \n" +
    "        <div class=\"col-md-6\">\n" +
    "          <div class=\"checkbox checkbox-primary\">\n" +
    "                <label>\n" +
    "                  <input type=\"checkbox\" ng-model=\"vm.event.monthly.isonthe\" ng-click=\"vm.selectMonthlyOnthe()\">\n" +
    "                  On the\n" +
    "                </label>\n" +
    "          </div>\n" +
    "          <div class=\"col-md-6\">\n" +
    "            <div class=\"form-group\" >\n" +
    "                <select id=\"trainingstyle\" class=\"form-control \" ng-model=\"vm.event.monthly.seq\" ui-select2 style=\"width: 100%\">\n" +
    "                  <option ng-repeat=\" p in vm.monthly.seq \"  >{{p}}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"col-md-6\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <select id=\"trainingstyle\" class=\"form-control \" ng-model=\"vm.event.monthly.day\" ui-select2 style=\"width: 100%\" >\n" +
    "                  <option ng-repeat=\"p in vm.monthly.days\"  >{{p}}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group col-md-12 animate-if\" ng-if=\"vm.event.repeat && vm.event.repeat != 'none'\" style=\"padding: 0px\">\n" +
    "\n" +
    "      <div style=\"float: left; margin-top: 5px; margin-right: 10px;\">\n" +
    "         <label style=\"display: inline-block;\">End repeat: </label>\n" +
    "         <div class=\"btn-group dropdown\" style=\"margin-left: 10px;\">\n" +
    "           <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\">{{vm.event.endRepeat}} <span class=\"caret\"></span></a>\n" +
    "           <ul class=\"dropdown-menu bullet\" aria-labelledby=\"exampleBulletDropdown1\" role=\"menu\">\n" +
    "              <li role=\"presentation\"><a href=\"javascript:void(0)\" role=\"menuitem\" ng-repeat=\"v in ['Never', 'After', 'On Date']\" ng-click=\"vm.setEndRepeat(v)\">{{v}}</a></li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "          <div style=\"display: inline; margin-left: 10px\" class=\"animate-if\" ng-if=\"vm.event.endRepeat==='After'\"> \n" +
    "            <input type=\"number\" class=\"form-control\" ng-model=\"vm.event.endAfter\" style=\"display: inline;width: 70px;\">\n" +
    "            <label>sessions</label>\n" +
    "          </div>\n" +
    "      </div>    \n" +
    "      <div ng-if=\"vm.event.endRepeat==='On Date'\" style=\"padding: 0px;\" class=\"animate-if\">\n" +
    "\n" +
    "        <div class=\"input-group \" style=\"width: 200px; margin-left: 10px;\" >\n" +
    "            <span class=\"input-group-addon\">\n" +
    "              <i class=\"icon wb-calendar\" aria-hidden=\"true\"></i>\n" +
    "            </span>\n" +
    "            <input type=\"text\" id=\"startDate\" class=\"form-control\" datepicker ng-model=\"vm.event.endOn\">\n" +
    "         </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div gallery files=\"vm.event.attachments\" type='image' gallery-title=\"Attachments\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" id=\"editColor\">\n" +
    "      <label class=\"control-label\">Color:</label>\n" +
    "      <div class=\"form-control\" style=\"border: none;\">\n" +
    "        <ul class=\"color-selector\">\n" +
    "          <li class=\"bg-blue-600\">\n" +
    "            <input type=\"radio\" data-color=\"blue|600\" name=\"colorChosen\" id=\"editColorChosen2\" ng-model=\"vm.event.color\" ng-value=\"'#1e88e5'\">\n" +
    "            <label for=\"editColorChosen2\"></label>\n" +
    "          </li>\n" +
    "          <li class=\"bg-green-600\">\n" +
    "            <input type=\"radio\" data-color=\"green|600\" name=\"colorChosen\" id=\"editColorChosen3\"  ng-model=\"vm.event.color\" ng-value=\"'#43a047'\">\n" +
    "            <label for=\"editColorChosen3\"></label>\n" +
    "          </li>\n" +
    "          <li class=\"bg-cyan-600\">\n" +
    "            <input type=\"radio\" data-color=\"cyan|600\" name=\"colorChosen\" id=\"editColorChosen4\"  ng-model=\"vm.event.color\" ng-value=\"'#00acc1'\">\n" +
    "            <label for=\"editColorChosen4\"></label>\n" +
    "          </li>\n" +
    "          <li class=\"bg-orange-600\">\n" +
    "            <input type=\"radio\" data-color=\"orange|600\" name=\"colorChosen\" id=\"editColorChosen5\"  ng-model=\"vm.event.color\" ng-value=\"'#fb8c00'\">\n" +
    "            <label for=\"editColorChosen4\"></label>\n" +
    "          </li>\n" +
    "          <li class=\"bg-red-600\">\n" +
    "            <input type=\"radio\" data-color=\"red|600\" name=\"colorChosen\" id=\"editColorChosen6\"  ng-model=\"vm.event.color\" ng-value=\"'#e53935'\">\n" +
    "            <label for=\"editColorChosen6\"></label>\n" +
    "          </li>\n" +
    "          <li class=\"bg-blue-grey-600\">\n" +
    "            <input type=\"radio\" data-color=\"blue-grey|600\" name=\"colorChosen\" id=\"editColorChosen7\"  ng-model=\"vm.event.color\" ng-value=\"'#546e7a'\">\n" +
    "            <label for=\"editColorChosen7\"></label>\n" +
    "          </li>\n" +
    "          <li class=\"bg-purple-600\">\n" +
    "            <input type=\"radio\" data-color=\"purple|600\" name=\"colorChosen\" id=\"editColorChosen8\"  ng-model=\"vm.event.color\" ng-value=\"'#8e24aa'\">\n" +
    "            <label for=\"editColorChosen8\"></label>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "<!-- \n" +
    "    <div style=\"text-align: left;\">\n" +
    "         <a href=\"#\" class=\"btn btn-success btn-raised\" ng-click=\"vm.update()\" ng-if=\"vm.event._id\">Accept</a>\n" +
    "         <a href=\"#\" class=\"btn btn-danger btn-raised\" ng-click=\"vm.update()\" ng-if=\"vm.event._id\">Decline</a>\n" +
    "    </div> -->\n" +
    "    <div style=\"text-align: right;\">\n" +
    "        <button type=\"submit\" class=\"btn btn-primary btn-raised\" ng-if=\"vm.event._id\">Save</button>\n" +
    "        <button type=\"submit\"  class=\"btn btn-primary btn-raised\"  ng-if=\"!vm.event._id\">Create</button>\n" +
    "        <a href=\"#\"  class=\"btn btn-danger btn-raised\" ng-click=\"vm.delete()\"  ng-if=\"vm.event._id\">Delete</button>\n" +
    "        <a href=\"#\"  class=\"btn btn-default btn-raised\" ng-click=\"vm.cancel()\"  ng-if=\"!vm.event._id\">Cancel</button>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "    \n" +
    "\n" +
    "\n" +
    "</form>\n" +
    "");
}]);

angular.module("events/events.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("events/events.tpl.html",
    "<div class=\"row\">\n" +
    "	<div id=\"wrapper\">\n" +
    "		\n" +
    "		<wallnav />\n" +
    "\n" +
    "		<div id=\"page-content-wrapper\" style=\"padding-left: 5px; padding-right: 5px; padding-bottom: 0px; padding-top: 5px; \">\n" +
    "			<div class=\"page-header padding-top-10 padding-bottom-10 \">\n" +
    "			    <span class=\"page-title\"><i class=\"icon fa-bank\" aria-hidden=\"true\"></i>Kushi Painting School</span>\n" +
    "			    <div class=\"page-header-actions\">\n" +
    "			    	<button type=\"button\" class=\"btn btn-raised  btn-primary btn-sm\"><i class=\"icon fa-plus\" aria-hidden=\"true\"></i>Event </button>\n" +
    "			    </div>\n" +
    "			</div>\n" +
    "\n" +
    "			<div class=\"panel\">\n" +
    "				<div class=\"panel-body\">	\n" +
    "					<calendar events=\"vm1.events\" on-select-event=\"vm1.onSelectEvent(event)\" on-select-slot=\"vm1.onSelectSlot(slotInfo)\" on-view=\"vm1.onView(view)\" on-navigate=\"vm1.onNavigate(date, view)\" view=\"week\"/>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("login/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/login.tpl.html",
    "<link rel=\"stylesheet\" href=\"assets/css/login-v3.css\">\n" +
    "\n" +
    "\n" +
    "    <div class=\"page-login-v3 layout-full\">\n" +
    "      <div class=\"page  vertical-align text-center\" >\n" +
    "        <div class=\"page-content vertical-align-middle\">\n" +
    "          <div class=\"panel\">\n" +
    "            <div class=\"panel-body\">\n" +
    "              <div class=\"brand\">\n" +
    "                <img class=\"brand-img\" src=\"assets//images/logo-blue.png\" alt=\"...\">\n" +
    "                <h2 class=\"brand-text font-size-18\">trainmoo</h2>\n" +
    "              </div>\n" +
    "             \n" +
    "              <form name=\"Form\" id=\"form\" novalidate ng-submit=\"form.submit(Form)\">\n" +
    "                <div class=\"form-group form-material floating\" floating>\n" +
    "                  <input type=\"email\" class=\"form-control\" ng-model=\"user.email\" required/>\n" +
    "                  <label class=\"floating-label\">Email</label>\n" +
    "                </div>\n" +
    "                <div class=\"form-group form-material floating\" floating>\n" +
    "                  <input type=\"password\" class=\"form-control\" ng-model=\"user.password\" required/>\n" +
    "                  <label class=\"floating-label\">Password</label>\n" +
    "                </div>\n" +
    "                <div class=\"form-group clearfix\">\n" +
    "                  <div class=\"checkbox-custom checkbox-inline checkbox-primary checkbox-lg pull-left\">\n" +
    "                    <input type=\"checkbox\" id=\"inputCheckbox\" ng-model=\"user.remember\">\n" +
    "                    <label for=\"inputCheckbox\">Remember me</label>\n" +
    "                  </div>\n" +
    "                  <a class=\"pull-right\" href=\"forgot-password.html\">Forgot password?</a>\n" +
    "                </div>\n" +
    "                <button type=\"submit\" class=\"btn btn-primary btn-block btn-lg margin-top-40\">Sign in</button>\n" +
    "              </form>\n" +
    "              \n" +
    "              <p>Still no account? Please go to <a href=\"/signup\">Sign up</a></p>\n" +
    "              <p>Login or Register with:</p> <a ng-click=\"authWithGoogle()\" class=\"btn btn-danger\"><span class=\"fa fa-google-plus\"></span> Google</a>\n" +
    "\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <footer class=\"page-copyright page-copyright-inverse\">\n" +
    "            <p>WEBSITE BY Rauzr Inc</p>\n" +
    "            <p>© 2016. All RIGHT RESERVED.</p>\n" +
    "            <div class=\"social\">\n" +
    "              <a class=\"btn btn-icon btn-pure\" href=\"javascript:void(0)\">\n" +
    "                <i class=\"icon bd-twitter\" aria-hidden=\"true\"></i>\n" +
    "              </a>\n" +
    "              <a class=\"btn btn-icon btn-pure\" href=\"javascript:void(0)\">\n" +
    "                <i class=\"icon bd-facebook\" aria-hidden=\"true\"></i>\n" +
    "              </a>\n" +
    "              <a class=\"btn btn-icon btn-pure\" href=\"javascript:void(0)\">\n" +
    "                <i class=\"icon bd-google-plus\" aria-hidden=\"true\"></i>\n" +
    "              </a>\n" +
    "            </div>\n" +
    "          </footer>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "");
}]);

angular.module("login/signup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("login/signup.tpl.html",
    "<link rel=\"stylesheet\" href=\"assets/css/register-v3.css\">\n" +
    "\n" +
    "<div class=\"page-register-v3 layout-full\">\n" +
    "  <div class=\"page  vertical-align text-center\" >\n" +
    "    <div class=\"page-content vertical-align-middle\">\n" +
    "      <div class=\"panel\">\n" +
    "        <div class=\"panel-body\">\n" +
    "          <div class=\"brand\">\n" +
    "            <img class=\"brand-img\" src=\"assets//images/logo-blue.png\" alt=\"...\">\n" +
    "            <h2 class=\"brand-text font-size-18\">trainmoo</h2>\n" +
    "          </div>\n" +
    "          <form name=\"Form\" id=\"form\" novalidate ng-submit=\"form.submit(Form)\">\n" +
    "            \n" +
    "            <div class=\"form-group form-material floating\" floating>\n" +
    "              <input type=\"text\" class=\"form-control\" ng-model=\"user.name.firstname\" required />\n" +
    "              <label class=\"floating-label\">First Name</label>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group form-material floating\" floating>\n" +
    "              <input type=\"text\" class=\"form-control\" ng-model=\"user.name.lastname\" required />\n" +
    "              <label class=\"floating-label\">Last Name</label>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"form-group form-material\">\n" +
    "              <label class=\"pull-left\">I am a &nbsp;</label>\n" +
    "              <div class=\"radio-custom radio-success inline small\" ng-repeat=\"userType in userTypes\" >\n" +
    "                <input type=\"radio\" ng-model=\"user.userType\" ng-value=\"userType\" id=\"{{userType}}\" checked=\"false\" />\n" +
    "                <label for=\"{{userType}}\"><b>{{userType}}</b></label>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group form-material floating\" floating >\n" +
    "              <input type=\"email\" class=\"form-control\" ng-model=\"user.email\" required/>\n" +
    "              <label class=\"floating-label\">Email</label>\n" +
    "            </div>\n" +
    "            <div class=\"form-group form-material floating\" floating>\n" +
    "              <input type=\"password\" class=\"form-control\" ng-model=\"user.password\" required/>\n" +
    "              <label class=\"floating-label\">Password</label>\n" +
    "            </div>\n" +
    "            <button type=\"submit\" class=\"btn btn-primary btn-block btn-lg margin-top-40\">Sign up</button>\n" +
    "          </form>\n" +
    "          <p>Have account already? Please go to <a href=\"/login\">Sign In</a></p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <footer class=\"page-copyright page-copyright-inverse\">\n" +
    "        <p>WEBSITE BY Rauzr Inc</p>\n" +
    "        <p>© 2016. All RIGHT RESERVED.</p>\n" +
    "        <div class=\"social\">\n" +
    "          <a class=\"btn btn-icon btn-pure\" href=\"javascript:void(0)\">\n" +
    "            <i class=\"icon bd-twitter\" aria-hidden=\"true\"></i>\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-icon btn-pure\" href=\"javascript:void(0)\">\n" +
    "            <i class=\"icon bd-facebook\" aria-hidden=\"true\"></i>\n" +
    "          </a>\n" +
    "          <a class=\"btn btn-icon btn-pure\" href=\"javascript:void(0)\">\n" +
    "            <i class=\"icon bd-google-plus\" aria-hidden=\"true\"></i>\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </footer>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("nav/nav.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("nav/nav.tpl.html",
    "<div id=\"sidebar-wrapper\">\n" +
    "  <ul class=\"sidebar-nav\">\n" +
    "    <!-- <li class=\"sidebar-category\">\n" +
    "       <a href=\"#\">View Posts</a>\n" +
    "    </li> -->\n" +
    "    \n" +
    "\n" +
    "    <li class=\"sidebar-category\" ng-if=\"vm.hasPrograms\">\n" +
    "       Programs\n" +
    "    </li>\n" +
    "    <li class=\"sidebar-item\" ng-repeat=\"p in vm.programs\" ng-if=\"vm.hasPrograms\"> \n" +
    "      <a href=\"#\" ng-click=\"vm.selectProgram(p.id)\" ng-class=\"p.id === vm.selection.program.id ? 'active' : ''\">{{p.name}}\n" +
    "        <div style=\"position: absolute;right: 30px;display: inline-block; vertical-align: middle;\" \n" +
    "                ng-if=\"p.newItems > 0\">\n" +
    "            <span class=\"badge badge-danger\" >2</span>\n" +
    "        </div>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "\n" +
    "    <li class=\"sidebar-category\" ng-if=\"vm.hasClasses\">\n" +
    "      Classes\n" +
    "    </li>\n" +
    "    <li class=\"sidebar-item\" ng-repeat=\"c in vm.visibleClasses\" ng-if=\"vm.hasClasses\">\n" +
    "      <a href=\"#\" ng-click=\"vm.selectClass(c.id)\" ng-class=\"c.id === vm.selection.class.id ? 'active' : ''\">\n" +
    "        {{c.name}}\n" +
    "        <div style=\"position: absolute;right: 30px;display: inline-block; vertical-align: middle;\" \n" +
    "              ng-if=\"c.newItems > 0\">\n" +
    "          <span class=\"badge badge-danger\" >2</span>\n" +
    "        </div>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "\n" +
    "    <li class=\"sidebar-category\" ng-if=\"vm.hasClasses\">\n" +
    "      Post Type\n" +
    "    </li>\n" +
    "    <li class=\"sidebar-item\" ng-repeat=\"type in vm.postTypes\">\n" +
    "      <a href=\"#\" ng-click=\"vm.selectPostType(type)\" \n" +
    "              ng-class=\"type.name === vm.selection.postType.name ? 'active' : ''\">\n" +
    "        <i ng-class=\"type.icon\" class=\"site-menu-icon\" aria-hidden=\"true\"></i>\n" +
    "        {{type.name}}\n" +
    "        <div style=\"position: absolute;right: 30px;display: inline-block; vertical-align: middle;\" \n" +
    "              ng-if=\"type.newItems > 0\">\n" +
    "          <span class=\"badge badge-danger\" >2</span>\n" +
    "        </div>\n" +
    "        \n" +
    "      </a>\n" +
    "      \n" +
    "    </li>\n" +
    "\n" +
    "    \n" +
    "  </ul>\n" +
    "  <div class=\"sidebar-footer\">\n" +
    "      <a href=\"javascript: void(0);\" class=\"fold-show\" data-placement=\"top\" data-toggle=\"tooltip\"\n" +
    "      data-original-title=\"Settings\">\n" +
    "        <span class=\"icon wb-settings\" aria-hidden=\"true\"></span>\n" +
    "      </a>\n" +
    "      <a href=\"javascript: void(0);\" data-placement=\"top\" data-toggle=\"tooltip\" data-original-title=\"Lock\">\n" +
    "        <span class=\"icon wb-eye-close\" aria-hidden=\"true\"></span>\n" +
    "      </a>\n" +
    "      <a href=\"javascript: void(0);\" data-placement=\"top\" data-toggle=\"tooltip\" data-original-title=\"Logout\">\n" +
    "        <span class=\"icon wb-power\" aria-hidden=\"true\"></span>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("post/post.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("post/post.tpl.html",
    "<style type=\"text/css\">\n" +
    "    .app-message .page{height:-webkit-calc(100% - 44px);height:calc(100% - 44px)}.app-message .page-main{height:100%}.app-message .page-aside .form-control{border-radius:0;border-width:0 0 1px 0;border-color:rgba(0,0,0,.06);padding:10px 60px 10px 30px;height:56px}.app-message .page-aside .input-search-btn{padding-right:30px;border-radius:0}.app-message .page-aside-inner{height:100%}.app-message-list{height:-webkit-calc(100% - 56px);height:calc(100% - 56px)}.app-message-list .list-group .list-group-item{border-bottom:0;border-radius:0;padding:16px 30px;white-space:nowrap;z-index:0}.app-message-list .list-group .list-group-item.active,.app-message-list .list-group .list-group-item:hover{background-color:#e8f1f8}.app-message-list .list-group .list-group-item.active:after{width:1px;position:absolute;content:' ';height:100%;right:0;top:0;background:#62a8ea}.app-message-list .list-group .list-group-item .media-time{color:#a3afb7}.app-message-chats{padding:20px 30px;overflow-y:scroll;text-align:center;height:-webkit-calc(100% - 96px);height:calc(100% - 96px);background-color:#fff}.app-message-chats>.btn{color:#89bceb}.app-message-chats>.btn:hover{color:#76838f}.app-message-chats .chats{padding:0}.app-message-chats .chats .chat-avatar .avatar{width:60px;margin-top:-10px}.app-message-chats .chats .time{color:#a3afb7;font-size:12px;text-align:center;margin:40px 0}.app-message-input{position:relative;}.app-message-input .message-input{position:relative}.app-message-input .message-input textarea{height:36px;resize:none;max-height:100px;padding-right:110px}.app-message-input .message-input-actions{position:absolute;bottom:0;right:0}.app-message-input .message-input-actions input{display:none}.app-message-input .message-input-btn{position:absolute;bottom:30px;right:30px}@media (max-width:1199px){.app-message .page-aside .list-group-item{padding:14px 16px;font-size:12px}.app-message .page-aside .list-group-item h4{font-size:12px}.app-message .page-aside .list-group-item .avatar{width:34px}.app-message .page-aside .list-group-item .badge{padding:1px 4px}}@media (max-width:480px){.app-message .page{height:-webkit-calc(100% - 66px);height:calc(100% - 66px)}}\n" +
    "\n" +
    "     .commentOnFocus {\n" +
    "        overflow: hidden; \n" +
    "        word-wrap: break-word; \n" +
    "        height: 70px !important;\n" +
    "      }\n" +
    "\n" +
    "      .commentNotFocus {\n" +
    "        overflow: hidden; \n" +
    "        word-wrap: break-word; \n" +
    "        height: 40px !important;\n" +
    "      }\n" +
    "\n" +
    "      .post-label {\n" +
    "        margin-left: 10px;\n" +
    "        padding: 5px 10px;\n" +
    "        font-size: 12px;\n" +
    "        font-weight: 200;\n" +
    "      }\n" +
    "\n" +
    "      .select2-container {\n" +
    "        display: inherit;\n" +
    "      }\n" +
    "</style>\n" +
    "\n" +
    "<form  name=\"Form\" id=\"form1\" novalidate ng-submit=\"vm.form.submit(Form)\" class=\"form-inline\">\n" +
    "    <div class=\"panel  margin-bottom-10\" ng-cloak>\n" +
    "        <div class=\"panel-body padding-10\">\n" +
    "                <div class=\"app-message-input\">\n" +
    "                    <div class=\"message-input\"> \n" +
    "                      <comment-editor id=\"react\" content=\"vm.post.text\" placeholder=\"{{vm.placeholder}}\" readonly=\"false\" on-select=\"vm.editStarted()\" on-reset=\"vm.reset(true)\"> </comment-editor>\n" +
    "                      <div class=\"message-input-actions btn-group\" style=\"z-index: 1000;\">\n" +
    "                        <a class=\"btn btn-pure btn-icon btn-default\" type=\"button\" ng-click=\"vm.openCalendar()\">\n" +
    "                          <i class=\"icon wb-emoticon\" aria-hidden=\"true\"></i>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-pure btn-icon btn-default\" type=\"button\" ng-click=\"vm.uploadImages()\">\n" +
    "                          <i class=\"icon wb-image\" aria-hidden=\"true\"></i>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-pure btn-icon btn-default\" type=\"button\" ng-click=\"vm.uploadFiles()\">\n" +
    "                          <i class=\"icon wb-paperclip\" aria-hidden=\"true\"></i>\n" +
    "                        </a>\n" +
    "                        <a class=\"btn btn-pure btn-icon btn-default\" type=\"button\" ng-click=\"vm.openRichtext()\">\n" +
    "                          <i class=\"icon wb-pencil\" aria-hidden=\"true\"></i>\n" +
    "                        </a>\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            <div class=\"col-md-12 padding-right-0 padding-left-0\" style=\"margin-top: 10px;\" ng-if=\"vm.postSelected\" >\n" +
    "              <div class=\"col-md-8\" style=\"text-align: left; display: inline-block;\" >\n" +
    "                    <div class=\"float: left;\" ng-if=\"!vm.isReply\">\n" +
    "                      <div style=\"display: inline-block;  width: 120px;\" class=\"btn\" ng-if=\"!vm.reply\">\n" +
    "                        <div class=\"dropdown\"  >\n" +
    "                          <a class=\"dropdown-toggle inline-block\" data-toggle=\"dropdown\" href=\"#\" aria-expanded=\"true\" style=\"color: #62a8ea;\"><i ng-class=\"vm.selection.postType.icon\" class=\"site-menu-icon\" aria-hidden=\"true\"></i>{{vm.selection.postType.name}}<span class=\"caret\"></span></a>\n" +
    "                          <ul class=\"dropdown-menu animation-slide-down animation-middle-left animation-duration-250\" role=\"menu\">\n" +
    "                            <li role=\"presentation\" ng-repeat=\"postType in vm.postTypes\"> \n" +
    "                              <a href=\"#\" ng-click=\"vm.selectPostType(postType)\"><i ng-class=\"postType.icon\" class=\"site-menu-icon\" aria-hidden=\"true\"></i> {{postType.name}}</a>\n" +
    "                            </li>\n" +
    "                          </ul>\n" +
    "                        </div>\n" +
    "                      </div>\n" +
    "\n" +
    "                      <div style=\"display: inline-block\" ng-if=\"vm.selection.programLabel\">\n" +
    "                        <span class=\"label label-success post-label\">{{vm.selection.programLabel}}</span>\n" +
    "                      </div>\n" +
    "\n" +
    "                      <div style=\"display: inline-block\" ng-if=\"vm.selection.classLabel\">\n" +
    "                        <span class=\"label label-success post-label\">{{vm.selection.classLabel}}</span>\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "              </div>\n" +
    "\n" +
    "              \n" +
    "              <div class=\"col-md-4\" style=\"text-align: right;\">\n" +
    "                <button class=\"btn btn-default btn-sm btn-raised btn-default \" ng-click=\"vm.reset()\" style=\"width: 70px; height: 30px; margin-right: 10px;\">Cancel</button>\n" +
    "                <button class=\"btn btn-default btn-sm btn-raised btn-primary \" type=\"submit\" style=\"width: 70px; height: 30px;\">Post</button>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-md-12\" ng-if=\"vm.showBlogPreview\">\n" +
    "              <richtext-card rtpost=\"vm.post\"/>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"col-md-12\" ng-if=\"!vm.isReply && vm.postSelected && (vm.post.type === 'Assignment' || vm.post.type === 'Task')\" style=\"padding-left: 10px;\" >\n" +
    "              <hr />\n" +
    "              <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" for=\"datepicker\">Due by</label>\n" +
    "                <datepicker date-format=\"MM/dd/yyyy\" selector=\"form-control\"  id=\"datepicker\" style=\"float: initial;\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input class=\"form-control\" ng-model=\"vm.post.dueby\" />\n" +
    "                        <span class=\"input-group-addon\" style=\"cursor: pointer\">\n" +
    "                          <i class=\"fa fa-lg fa-calendar\"></i>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                </datepicker>\n" +
    "              </div>\n" +
    "\n" +
    "              <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" for=\"title\">Title </label>\n" +
    "                <select id=\"title\" class=\"form-control \" ng-model=\"vm.post.section\" ui-select2 style=\"min-width: 300px;\">\n" +
    "                  <option ng-repeat=\"p in vm.sections\" >{{p.name}}</option>\n" +
    "                </select>\n" +
    "              </div>\n" +
    "\n" +
    "              \n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"col-md-12 margin-top-20\" ng-if=\"vm.uploadImage\">\n" +
    "              <div gallery files=\"vm.post.files\" type='image' gallery-title=\"Attach Pictures\" ></div>\n" +
    "            </div>\n" +
    "            \n" +
    "            <div class=\"col-md-12 margin-top-20\" ng-if=\"vm.uploadFile\">\n" +
    "              <div gallery files=\"vm.post.files\" type='pdf' gallery-title=\"Attach Files(Pdfs)\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "    </div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("richtext/richtext.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("richtext/richtext.tpl.html",
    "<div class=\"page bg-white\" >\n" +
    "	<div class=\"page-content padding-top-25 padding-left-5 padding-right-5 container-fluid  \">\n" +
    "	    <div class=\"row\" style=\"width: 100%; margin: 0 auto;\">\n" +
    "	    	<richtext on-publish=\"onPublish()\" on-cancel=\"onCancel()\" richtextid=\"{{richtextid}}\" readonly=\"{{readonly}}\"/>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("richtext/richtextCard.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("richtext/richtextCard.tpl.html",
    "<style type=\"text/css\">\n" +
    "	.card {\n" +
    "	    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);\n" +
    "	    transition: 0.3s;\n" +
    "    	padding: 5px;\n" +
    "    	background: #F3F7F9;\n" +
    "	}\n" +
    "	\n" +
    "	.card:hover {\n" +
    "	    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);\n" +
    "	}\n" +
    "</style>\n" +
    " \n" +
    "<div style=\"margin-top: 10px;padding:5px;height: auto;cursor: pointer; border: 1px solid #f3f2f2; background: #F3F7F9;\" >\n" +
    "	 <div class=\"media\">\n" +
    "		<div class=\"media-left\" ng-if=\"rtpost.richtext.previewImg\">\n" +
    "		    <img class=\"media-object\" ng-src=\"{{rtpost.richtext.previewImg}}\" alt=\"...\">\n" +
    "		</div>\n" +
    "		<div class=\"media-body\">\n" +
    "		  <h4 class=\"media-heading\">{{rtpost.richtext.title}}</h4>\n" +
    "		  {{rtpost.richtext.previewText}}\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("school/appSchool.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("school/appSchool.tpl.html",
    "<div class=\"row\">\n" +
    "	<div id=\"wrapper\">\n" +
    "		\n" +
    "		<wallnav />\n" +
    "\n" +
    "		<div ui-view ng-cloak></div>\n" +
    "\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("school/class/classEdit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("school/class/classEdit.tpl.html",
    "<div ng-controller=\"classEditController as vm\">\n" +
    "\n" +
    "<form name=\"Form\" id=\"form\" novalidate ng-submit=\"form.submit(Form)\" >\n" +
    "\n" +
    "<div id=\"page-content-wrapper\" style=\"padding-left: 5px; padding-right: 5px; padding-bottom: 0px; padding-top: 5px; \">\n" +
    "\n" +
    "  <div class=\"page-header padding-top-10 padding-bottom-10 \">\n" +
    "    <h1 class=\"page-title\"> <i class=\"icon fa-language\" aria-hidden=\"true\"></i>  {{class.name}}&nbsp;&nbsp;&nbsp;&nbsp;</h1>\n" +
    "    \n" +
    "    <span class=\"text-extra-small\" ng-if=\"!Form.$dirty\">&nbsp;&nbsp;&nbsp;&nbsp;All changes are saved</span>\n" +
    "    <div class=\"page-header-actions\">\n" +
    "       <button type=\"button\" class=\"btn btn-raised  btn-default btn-sm\" ui-sref=\"app.apph.apps.classusers({schoolid: vm.schoolid, classid: vm.classid})\"  uib-tooltip=\"Users\" tooltip-placement=\"bottom\"  tooltip-trigger=\"'mouseenter'\" tooltip-append-to-body=\"true\"><i class=\"icon fa-users\" aria-hidden=\"true\"></i> </button>\n" +
    "       <button type=\"button\" class=\"btn btn-raised  btn-default btn-sm\" ui-sref=\"app.apph.events\"  uib-tooltip=\"Calendar\" tooltip-placement=\"bottom\"  tooltip-trigger=\"'mouseenter'\" tooltip-append-to-body=\"true\"><i class=\"icon fa-calendar \" aria-hidden=\"true\"></i> </button>\n" +
    "      <button  class=\"btn btn-raised btn-primary\" type=\"submit\"><i class=\"icon fa-save\" aria-hidden=\"true\"></i> Save </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"panel\">\n" +
    "      <div class=\"panel-body\" style=\"padding: 10px;\">  \n" +
    "\n" +
    "            <ul class=\"nav nav-tabs nav-tabs-line\" data-plugin=\"nav-tabs\" role=\"tablist\">\n" +
    "                <li class=\"active\" role=\"presentation\"><a data-toggle=\"tab\" href=\"#introTab\" aria-controls=\"introTab\" role=\"tab\" aria-expanded=\"false\">Intro</a></li>\n" +
    "                <li role=\"presentation\"><a data-toggle=\"tab\" href=\"#contactsTab\" aria-controls=\"contactsTab\" role=\"tab\" aria-expanded=\"false\">Contacts</a></li>\n" +
    "                <li role=\"presentation\"><a data-toggle=\"tab\" href=\"#summaryTab\" aria-controls=\"summaryTab\" role=\"tab\" aria-expanded=\"false\">Summary</a></li>\n" +
    "                <li role=\"presentation\"><a data-toggle=\"tab\" href=\"#curriculumTab\" aria-controls=\"curriculumTab\" role=\"tab\" aria-expanded=\"true\">Curriculum</a></li>\n" +
    "                <li role=\"presentation\"><a data-toggle=\"tab\" href=\"#locationTab\" aria-controls=\"locationTab\" role=\"tab\" aria-expanded=\"true\">Location</a></li>\n" +
    "                <li role=\"presentation\"><a data-toggle=\"tab\" href=\"#attachmentsTab\" aria-controls=\"attachmentsTab\" role=\"tab\" aria-expanded=\"true\">Attachments</a></li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <div class=\"tab-content padding-top-20\">\n" +
    "                <div class=\"tab-pane active\" id=\"introTab\" role=\"tabpanel\">\n" +
    "                 \n" +
    "                  <div class=\"col-md-5\">\n" +
    "\n" +
    "                      <div class=\"form-group\" ng-class=\"{'has-error':Form.name.$dirty && Form.name.$invalid, 'has-success':Form.name.$valid}\">\n" +
    "                          <label class=\"control-label\"> Name  <span class=\"symbol required\"></label>\n" +
    "                          <input type=\"text\" class=\"form-control underline\" id=\"name\" name=\"name\" ng-model=\"class.name\" required >\n" +
    "                          <span class=\"error text-small block\" ng-if=\"Form.name.$dirty && Form.name.$error.required\">Name is required.</span>\n" +
    "                      </div>\n" +
    "\n" +
    "                      <div class=\"form-group\" ng-if=\"vm.isClass\">\n" +
    "                          <label for=\"trainingstyle\" class=\"control-label\">Program</label>\n" +
    "                          <select id=\"trainingstyle\" class=\"form-control \" ng-model=\"class.program\" ui-select2 style=\"width: 100%\">\n" +
    "                            <option ng-repeat=\"p in vm.programs\" value=\"{{p._id}}\" >{{p.name}}</option>\n" +
    "                          </select>\n" +
    "                      </div>\n" +
    "\n" +
    "\n" +
    "                        \n" +
    "                      <div class=\"form-group\" >\n" +
    "                          <label for=\"categories\" class=\"control-label\">Category</label>\n" +
    "                          <select id=\"categories\" class=\"form-control \" multiple  ng-model=\"class.categories\" ui-select2 style=\"width: 100%\">\n" +
    "                            <option ng-repeat=\"item in vm.categories\" ng-bind=\"item.value\" value=\"{{item.value}}\"></option>\n" +
    "                          </select>\n" +
    "                          <p class=\"help-block text-small\">select 3 categories</p>\n" +
    "                      </div>\n" +
    "                      \n" +
    "\n" +
    "                      <div class=\"form-group\" >\n" +
    "                          <label for=\"trainingstyle\" class=\"control-label\">Medium</label>\n" +
    "                          <select id=\"trainingstyle\" class=\"form-control \" multiple ng-model=\"class.medium\" ui-select2 style=\"width: 100%\">\n" +
    "                            <option ng-repeat=\"option in vm.mediums\">{{option.value}}</option>\n" +
    "                          </select>\n" +
    "                          <p class=\"help-block text-small\">select 3 main mediums of teaching</p>\n" +
    "                      </div>\n" +
    "                      \n" +
    "\n" +
    "                      <div class=\"form-group\">\n" +
    "                          <label class=\"control-label\"> Phone <i class=\"icon fa-phone\" aria-hidden=\"true\"></i> </label>\n" +
    "                          <input type=\"text\" class=\"form-control\" id=\"phone\" name=\"phone\"  ui-mask=\"(999) 999-9999\"  ng-model=\"class.phone\" style=\"width: 200px;\">\n" +
    "                          <p class=\"help-block text-small\">(999) 999.9999</p>\n" +
    "                      </div>\n" +
    "\n" +
    "                      <div class=\"form-group\">\n" +
    "                          <label class=\"control-label\"> Website </label>\n" +
    "                          <input type=\"text\" class=\"form-control\" ng-model=\"class.website\"  >\n" +
    "                          <p class=\"help-block text-small\">www.myclass.com</p>\n" +
    "                      </div>\n" +
    "\n" +
    "                  </div>\n" +
    "                  <div class=\"col-md-offset-1 col-md-5\" ng-cloak>\n" +
    "\n" +
    "                      <div class=\"form-group\">\n" +
    "                          <label class=\"control-label\"> Capacity </label>\n" +
    "                          <select id=\"classCapacity\" class=\"form-control \" ng-model=\"class.capacity\" ui-select2 style=\"width: 200px;\">\n" +
    "                            <option ng-repeat=\"option in vm.classCapacity\">{{option.value}}</option>\n" +
    "                          </select>\n" +
    "                      </div>\n" +
    "                      <div class=\"form-group\">\n" +
    "                          <label class=\"control-label\"> Cost <i class=\"icon fa-money\" aria-hidden=\"true\"></i> </label>\n" +
    "                          <input type=\"text\" class=\"form-control underline\" ng-model=\"class.cost\" maskmoney width=\"200px;\">\n" +
    "                      </div>\n" +
    "\n" +
    "                      <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">Schedule <i class=\"icon fa-calendar-o\" aria-hidden=\"true\"></i></label>\n" +
    "                        <a href=\"#\" ng-click=\"openEvent()\"> \n" +
    "                          <div class=\"height-50 \">\n" +
    "                            <span class=\"form-control text-azure\" style=\"border: none;\">{{vm.schedule.repeatText}}</span>\n" +
    "                          </div>\n" +
    "                        </a>\n" +
    "                      </div>      \n" +
    "                  </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"tab-pane\" id=\"contactsTab\" role=\"tabpanel\">\n" +
    "                  <div class=\"height-200 margin-top-20 padding-20\" style=\"border: 2px solid #e4eaec;border-radius: 5px;\">                          \n" +
    "                    <h3>Contacts</h3>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "                <div class=\"tab-pane\" id=\"summaryTab\" role=\"tabpanel\">\n" +
    "                  <div class=\"form-group\" >\n" +
    "                          <label class=\"control-label \"> About {{class.name}} </label>\n" +
    "                          <richtext on-publish=\"onPublish()\" on-cancel=\"onCancel()\" richtextid=\"{{richtextid}}\" readonly=\"false\"/>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "                <div class=\"tab-pane\" id=\"curriculumTab\" role=\"tabpanel\">\n" +
    "                  <div class=\"form-group\">\n" +
    "                    <label class=\"control-label \"> Curriculum </label><br>\n" +
    "                    <div class=\"panel panel-bordered\" style=\"border: 1px solid #e4eaec; border-radius: 5px;\">\n" +
    "                      <div class=\"panel-body padding-10\" style=\" min-height: 200px;\" id=\"classSections\">\n" +
    "                        <ul class=\"list-group list-group-full\">\n" +
    "                          <li class=\"list-group-item padding-right-40\" ng-repeat=\"section in class.sections\">\n" +
    "                            <div ng-if=\"section.edit\" class=\"padding-10\">\n" +
    "                              <input type=\"text\" ng-model=\"section.title\" class=\"form-control\" placeholder=\"Enter section title\" /><br>\n" +
    "                              <textarea rows=\"4\" ng-model=\"section.summary\" class=\"form-control\" style=\"width: 100%\" placeholder=\"Section details\"></textarea> <br>\n" +
    "                              <button class=\"btn btn-primary btn-round\" ng-click=\"section.edit = false\">DONE</button> \n" +
    "                            </div>\n" +
    "                            <div ng-if=\"!section.edit\">\n" +
    "                              <h5 style=\"display: inline-block;\"> {{section.title}} </h5><div style=\"display: inline-block; \" class=\"pull-right\"> <a href=\"#\" ng-click=\"section.edit = true\"><i class=\"icon fa-edit\" aria-hidden=\"true\" ></i></a> &nbsp;&nbsp;<a href=\"#\" ng-click=\"removeSection(section.seq)\"> <i class=\"icon fa-remove\" aria-hidden=\"true\"></i></a></div>\n" +
    "                              <p class=\"padding-left-10\" style=\"white-space: pre-wrap;\">{{section.summary}}</p>\n" +
    "                            </div>\n" +
    "                          </li>\n" +
    "                        </ul>\n" +
    "                      </div>\n" +
    "\n" +
    "                      <div class=\"panel-footer padding-left-10\">\n" +
    "                        <div ng-if=\"!sectionAdd\"><button class=\"btn btn-primary btn-round\" ng-click=\"showAddSection()\">Create Section</button> &nbsp;&nbsp;<span class=\" label label-round label-success\" ng-if=\"showSuccess\"> {{successMessage}} </span>  </div>\n" +
    "                        <div ng-if=\"sectionAdd\" class=\"padding-10\">\n" +
    "                          <h5>New Section</h5>\n" +
    "                          <input type=\"text\" ng-model=\"newSection.title\" class=\"form-control\" placeholder=\"Enter section title\" /><br>\n" +
    "                          <textarea rows=\"4\" ng-model=\"newSection.summary\" class=\"form-control\" style=\"width: 100%\" placeholder=\"Section details\"></textarea> <br>\n" +
    "                          <button class=\"btn btn-primary btn-round\" ng-click=\"addNewSection()\">ADD</button> <button class=\"btn btn-default btn-round\" ng-click=\"hideAddSection()\">Cancel</button>\n" +
    "                        </div>\n" +
    "                      </div>\n" +
    "\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "                <div class=\"tab-pane\" id=\"locationTab\" role=\"tabpanel\">\n" +
    "                  <div class=\"form-group\" >\n" +
    "                          <label class=\"control-label \"> Location </label>\n" +
    "                          <div class=\"gmap height-300\" placeid=\"class.placeid\" address=\"class.address\" ng-cloak></div>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "                <div class=\"tab-pane\" id=\"attachmentsTab\" role=\"tabpanel\">\n" +
    "                  <div class=\"margin-top-20\">\n" +
    "                    <div gallery files=\"class.gallery\" type='image' gallery-title=\"Photo Gallery\"></div>\n" +
    "                  </div>\n" +
    "                  \n" +
    "                  <div class=\"margin-top-20\">\n" +
    "                    <div gallery files=\"class.attachments\" type='pdf' gallery-title=\"Additional Information\"></div>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "      </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("school/pdfview.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("school/pdfview.tpl.html",
    "<ng-pdf template-url=\"shared/pdfviewer.tpl.html\" canvasid=\"pdf\" scale=\"page-fit\" page=1></ng-pdf>");
}]);

angular.module("school/school.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("school/school.tpl.html",
    "<div id=\"page-content-wrapper\" style=\"padding-left: 5px; padding-right: 5px; padding-bottom: 0px; padding-top: 5px; \">\n" +
    "\n" +
    "	<div class=\"page-header padding-top-10 padding-bottom-10 \">\n" +
    "	    <span class=\"page-title\"><i class=\"icon fa-bank\" aria-hidden=\"true\"></i>Kushi Painting School</span> &nbsp;&nbsp;&nbsp;<button type=\"button\" class=\"btn btn-raised btn-info  btn-sm\">Programs <span class=\"badge\">1</span> </button>&nbsp;&nbsp;&nbsp;<button type=\"button\" class=\"btn btn-raised btn-info  btn-sm\">Classes <span class=\"badge\">2</span> </button>\n" +
    "\n" +
    "	    <div class=\"page-header-actions\">\n" +
    "	    	<button type=\"button\" class=\"btn btn-raised  btn-default btn-sm\" ui-sref=\"app.apph.apps.schoolusers({schoolid: schoolid})\"  uib-tooltip=\"Users\" tooltip-placement=\"bottom\"  tooltip-trigger=\"'mouseenter'\" tooltip-append-to-body=\"true\"><i class=\"icon fa-users\" aria-hidden=\"true\"></i> </button>\n" +
    "	        <button type=\"button\" class=\"btn btn-raised  btn-default  btn-sm\" ui-sref=\"app.apph.apps.schoolEdit\" uib-tooltip=\"Edit School\" tooltip-placement=\"bottom\"  tooltip-trigger=\"'mouseenter'\" tooltip-append-to-body=\"true\"><i class=\"icon fa-edit\" aria-hidden=\"true\"></i> </button>\n" +
    "		    <button type=\"button\" class=\"btn btn-raised btn-default  btn-sm\" ui-sref=\"app.apph.apps.program({schoolid: schoolid, classid: ''})\" uib-tooltip=\"Create Program\" tooltip-placement=\"bottom\"  tooltip-trigger=\"'mouseenter'\" tooltip-append-to-body=\"true\"><i class=\"icon fa-plus\" aria-hidden=\"true\"></i> Program </button>\n" +
    "		    <button type=\"button\" class=\"btn btn-raised btn-default  btn-sm\" ui-sref=\"app.apph.apps.class({schoolid: schoolid, classid: ''})\" uib-tooltip=\"Create Class\" tooltip-placement=\"bottom\"  tooltip-trigger=\"'mouseenter'\" tooltip-append-to-body=\"true\"><i class=\"icon fa-plus\" aria-hidden=\"true\"></i> Class </button>\n" +
    "	    </div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"panel\">\n" +
    "		<div class=\"panel-body\" style=\"padding: 0px;\">	\n" +
    "			<table class=\"table no-margin\">\n" +
    "				<tbody>\n" +
    "					<tr ng-repeat=\"clazz in classes\" ng-cloak>\n" +
    "						<td class=\"max-width-100 hidden-xs\">\n" +
    "							<div class=\"icons-effect padding-10\">\n" +
    "								<img src=\"assets/images/avatar-1-small.jpg\" class=\"img-rounded img-responsive\" style=\"height: 70px;\" alt=\"\">\n" +
    "							</div>\n" +
    "						</td>\n" +
    "						<td>\n" +
    "							<div class=\"padding-10\">\n" +
    "								<div class=\"title\">\n" +
    "									<a ui-sref=\"app.apph.apps.program({schoolid: schoolid, classid: clazz._id})\" ng-if=\"clazz.type === 'program'\"> <strong style=\"margin-right: 20px\">{{clazz.name}}</strong> <span class=\"label label-info\">{{clazz.type}} </span></a> \n" +
    "									<a ui-sref=\"app.apph.apps.class({schoolid: schoolid, classid: clazz._id})\" ng-if=\"clazz.type === 'class'\"\"><strong style=\"margin-right: 20px\">{{clazz.name}}</strong><span class=\"label label-info\">Class </span> </a> \n" +
    "\n" +
    "								</div>\n" +
    "								<span class=\"abstract\">Reiciendis iactant eligendi. Vestrae </span>\n" +
    "								<div class=\"abstract\">\n" +
    "									<a href=\"#\" class=\"margin-right-10 \">\n" +
    "										<i class=\"fa fa-user \"></i> Rambabu Ravuri\n" +
    "									</a>\n" +
    "									<span class='time'><i class=\"fa fa-clock-o \"></i>10-11am Mon-Tue-Fri</span>\n" +
    "								</div>									\n" +
    "							</div>\n" +
    "						</td>\n" +
    "						<td class=\"hidden-xs\">\n" +
    "							<div class=\"block padding-10\">\n" +
    "										<a ui-sref=\"app.apph.apps.classusers({schoolid: schoolid, classid: clazz._id})\" class=\"margin-right-10 text-small block\">\n" +
    "											<i class=\"fa fa-users\"></i> Users\n" +
    "										</a>\n" +
    "										<a href=\"#\" class=\"margin-right-10 block  text-small\">\n" +
    "											<i class=\"fa fa-bar-chart \"></i> Grades \n" +
    "										</a>\n" +
    "										\n" +
    "										<a href=\"#\" class=\"block  text-small\">\n" +
    "											<i class=\"fa fa-money \"></i> Payment\n" +
    "										</a>\n" +
    "										\n" +
    "										<a href=\"#\" class=\"block  text-small\">\n" +
    "											<i class=\"fa fa-calendar \"></i> Time table\n" +
    "										</a>\n" +
    "\n" +
    "									</div>\n" +
    "						</td>\n" +
    "						<td class=\"visible-lg\">\n" +
    "						 <div class=\"padding-10\">\n" +
    "							<div class=\"col-xs-4 text-center\">\n" +
    "								<div class=\"counter\">\n" +
    "									<div class=\"counter-label\">Students</div>\n" +
    "									<div class=\"counter-number\">200</div>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "							<div class=\"col-xs-4 no-padding text-center\">\n" +
    "								<div class=\"counter\">\n" +
    "									<div class=\"counter-label\">Classes</div>\n" +
    "									<div class=\"counter-number\">200</div>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "							<div class=\"col-xs-4 no-padding text-center\">\n" +
    "								<div class=\"counter\">\n" +
    "									<div class=\"counter-label\">Posts</div>\n" +
    "									<div class=\"counter-number\">200</div>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "						  </div>\n" +
    "						</td>\n" +
    "					</tr>\n" +
    "					\n" +
    "				</tbody>\n" +
    "			</table>\n" +
    "\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("school/schoolEdit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("school/schoolEdit.tpl.html",
    "<div ng-controller=\"schoolEditController as vm\">\n" +
    "\n" +
    "<form name=\"Form\" id=\"form\" novalidate ng-submit=\"form.submit(Form)\" >\n" +
    "\n" +
    "<div class=\"page-header padding-left-40 padding-top-10 padding-bottom-0\" ng-cloak>\n" +
    "  <h1 class=\"page-title\"> <i class=\"icon fa-bank\" aria-hidden=\"true\"></i>  {{school.name}}&nbsp;&nbsp;&nbsp;&nbsp;</h1>\n" +
    "  <button  class=\"btn btn-raised btn-primary\" type=\"submit\"><i class=\"icon fa-save\" aria-hidden=\"true\"></i> Save </button>\n" +
    "  <span class=\"text-extra-small\" ng-if=\"!Form.$dirty\">&nbsp;&nbsp;&nbsp;&nbsp;All changes are saved</span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" ng-cloak>\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div id=\"panel_edit_account\" >\n" +
    "      <fieldset ng-disabled=\"disableForm\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-5\">\n" +
    "                    <div class=\"row\">\n" +
    "                      <div class=\"col-md-4\" style=\"height: 80px;padding: 0px; overflow:hidden\">\n" +
    "                        <div gallery files=\"school.avatar\" type='image' class=\"padding-0\" single='true' style=\"max-height: 80px; width: auto;\" size='sm'></div>\n" +
    "                      </div>\n" +
    "\n" +
    "                      <div class=\"col-md-8\">\n" +
    "                        <div class=\"form-group\" ng-class=\"{'has-error':Form.name.$dirty && Form.name.$invalid, 'has-success':Form.name.$valid}\">\n" +
    "                            <label class=\"control-label\"> Name  <span class=\"symbol required\"></label>\n" +
    "                            <input type=\"text\" class=\"form-control underline\" id=\"name\" name=\"name\" ng-model=\"school.name\" required >\n" +
    "                            <span class=\"error text-small block\" ng-if=\"Form.name.$dirty && Form.name.$error.required\">Name is required.</span>\n" +
    "                        </div>\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "                      \n" +
    "                    <div class=\"form-group\" >\n" +
    "                        <label for=\"categories\" class=\"control-label\">Category</label>\n" +
    "                        <select id=\"categories\" class=\"form-control \" multiple  ng-model=\"school.categories\" ui-select2 style=\"width: 100%\">\n" +
    "                          <option ng-repeat=\"item in vm.categories\" ng-bind=\"item.value\" value=\"{{item.value}}\"></option>\n" +
    "                        </select>\n" +
    "                        <p class=\"help-block text-small\">select 3 categories</p>\n" +
    "                    </div>\n" +
    "                    \n" +
    "\n" +
    "                    <div class=\"form-group\" >\n" +
    "                        <label for=\"trainingstyle\" class=\"control-label\">Medium</label>\n" +
    "                        <select id=\"trainingstyle\" class=\"form-control \" multiple ng-model=\"school.medium\" ui-select2 style=\"width: 100%\">\n" +
    "                          <option ng-repeat=\"option in vm.mediums\">{{option.value}}</option>\n" +
    "                        </select>\n" +
    "                        <p class=\"help-block text-small\">select 3 main mediums of teaching</p>\n" +
    "                    </div>\n" +
    "                    \n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\"> Phone</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"phone\" name=\"phone\"  ui-mask=\"(999) 999-9999\"  ng-model=\"school.phone\">\n" +
    "                        <p class=\"help-block text-small\">(999) 999.9999</p>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\"> Website</label>\n" +
    "                        <input type=\"text\" class=\"form-control underline\" ng-model=\"school.website\"  >\n" +
    "                        <p class=\"help-block text-small\">www.myschool.com</p>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <div class=\"col-md-offset-1 col-md-5\" ng-cloak>\n" +
    "                    <div class=\"height-250 margin-top-20 padding-20\" style=\"border: 2px solid #e4eaec;border-radius: 5px;\">                          \n" +
    "                      <script type=\"text/ng-template\" id=\"customTemplate.html\">\n" +
    "                        <a>\n" +
    "\n" +
    "                            <img ng-src=\"http://upload.wikimedia.org/wikipedia/commons/thumb/{{match.model.flag}}\" style=\"float: left;\" width=\"32\" height=\"32\">\n" +
    "                            <span ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"></span><br>\n" +
    "                            <span class=\"text-small\">State of champions</span>\n" +
    "                        </a>\n" +
    "                      </script>\n" +
    "                      <pre>Model: {{selected | json}}</pre>\n" +
    "                      <input type=\"text\" ng-model=\"customSelected\" placeholder=\"Custom template\" uib-typeahead=\"state as state.name for state in statesWithFlags  | filter:{name:$viewValue} | limitTo:8\" typeahead-template-url=\"customTemplate.html\" class=\"form-control\" typeahead-show-hint=\"true\"  typeahead-on-select=\"itemSelected($item, $model, $label, $event);customSelected=''\" typeahead-min-length=\"2\" typeahead-wait-ms=\"500\">\n" +
    "\n" +
    "                      <ul>\n" +
    "                        <li ng-repeat=\"value in selectedStates\">\n" +
    "                          <div>\n" +
    "                              <img ng-src=\"http://upload.wikimedia.org/wikipedia/commons/thumb/{{match.model.flag}}\" style=\"float: left;\" width=\"32\" height=\"32\">\n" +
    "                              <span ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"></span><br>\n" +
    "                              <span class=\"text-small\">State of champions</span>\n" +
    "                          </div>\n" +
    "                        </li>\n" +
    "                      </ul>\n" +
    "\n" +
    "                    </div>\n" +
    "                    <div class=\"height-200 margin-top-20 padding-20\" style=\"border: 2px solid #e4eaec;border-radius: 5px;\">                          \n" +
    "                      <h3>Contacts</h3>\n" +
    "\n" +
    "                    </div>\n" +
    "                  \n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "\n" +
    "              <div class=\"col-md-12 margin-top-20\">\n" +
    "                 <div class=\"form-group\" >\n" +
    "                          <label class=\"control-label \"> About {{school.name}} </label>\n" +
    "                          <div id=\"react\" draft content=\"school.profile\" readonly=\"true\"> </div>\n" +
    "                  </div>\n" +
    "              </div>            \n" +
    "              <div class=\"col-md-12 margin-top-20\" >\n" +
    "              <div class=\"form-group\" >\n" +
    "                      <label class=\"control-label \"> Location </label>\n" +
    "                      <div class=\"gmap height-300\" placeid=\"school.placeid\" address=\"school.address\" ng-cloak></div>\n" +
    "              </div>\n" +
    "              </div>\n" +
    "              <div class=\"col-md-12 margin-top-20\">\n" +
    "                <div gallery files=\"school.gallery\" type='image' gallery-title=\"Photo Gallery\"></div>\n" +
    "              </div>\n" +
    "              \n" +
    "              <div class=\"col-md-12 margin-top-20\">\n" +
    "                <div gallery files=\"school.attachments\" type='pdf' gallery-title=\"Additional Information\"></div>\n" +
    "              </div>\n" +
    "\n" +
    "      </fieldset>\n" +
    "       \n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "</form>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("school/users/classUser.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("school/users/classUser.tpl.html",
    "<style type=\"text/css\">\n" +
    "    \n" +
    "    .role {\n" +
    "\n" +
    "      margin : 0px 10px 10px 0px;\n" +
    "      \n" +
    "    }\n" +
    "\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\" id=\"modal-title\">{{userType}}</h3>\n" +
    "</div>\n" +
    "\n" +
    "<form name=\"Form\" id=\"form\" novalidate ng-submit=\"vm.form.submit(Form)\" >\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label\">Register</label>\n" +
    "      <div class=\"form-control no-border\">\n" +
    "        <a href=\"#\" class=\"btn btn-raised role\" ng-class=\"vm.user.type === userType? 'btn-success' : 'btn-default'\" ng-repeat=\"userType in ['teacher', 'admin', 'student', 'parent']\" ng-click=\"vm.selectUserType(userType)\">{{userType}}</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"form-group \">\n" +
    "      <label class=\"control-label\">Using</label>\n" +
    "      <div class=\"form-control no-border\">\n" +
    "        <a href=\"#\" class=\"btn btn-raised margin-right-10\" ng-class=\"vm.user.registerUsing === type? 'btn-success' : 'btn-default'\" ng-repeat=\"type in ['email', 'mobile']\" ng-click=\"vm.selectRegisterType(type)\">{{type}}</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>\n" +
    "            Email\n" +
    "        </label>\n" +
    "        <input type=\"email\"  class=\"form-control\" name=\"email\" ng-model=\"vm.user.email\"  ng-required=\"vm.user.registerUsing === 'Email'\">\n" +
    "        <span class=\"error text-small block\" ng-if=\"Form.email.$dirty && Form.email.$error.required\">Email is required.</span>\n" +
    "        <span class=\"error text-small block\" ng-if=\"Form.email.$error.email\">Enter valid email.</span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>\n" +
    "            Mobile\n" +
    "        </label>\n" +
    "        <input type=\"text\"  class=\"form-control\" name=\"mobile\" ng-model=\"vm.user.mobile\" ng-required=\"vm.user.registerUsing === 'Mobile'\" ui-mask=\"(999) 999 - 9999\" ui-options=\"{clearOnBlur: false, addDefaultPlaceholder: false}\">\n" +
    "        <span class=\"error text-small block\" ng-if=\"Form.mobile.$dirty && Form.mobile.$error.required\">Mobile is required.</span>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>\n" +
    "            Name\n" +
    "        </label>\n" +
    "        <input type=\"text\"  class=\"form-control\" ng-model=\"vm.user.name\" name=\"name\" required>\n" +
    "        <span class=\"error text-small block\" ng-if=\"Form.name.$dirty && Form.name.$error.required\">Name is required.</span>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "      <button class=\"btn btn-default btn-raised\" ng-click=\"cancel()\">\n" +
    "          Cancel\n" +
    "      </button>\n" +
    "\n" +
    "      <button class=\"btn btn-primary btn-raised\" type=\"submit\">\n" +
    "          Save User\n" +
    "      </button>\n" +
    "      \n" +
    "  </div>\n" +
    "\n" +
    "</form>\n" +
    "");
}]);

angular.module("school/users/classUsers.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("school/users/classUsers.tpl.html",
    "<style type=\"text/css\">\n" +
    "  .list-group .list-group-item:hover {\n" +
    "    background-color: #FAFAFA !important;\n" +
    "  }\n" +
    "</style>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"customTemplate.html\">\n" +
    "  <a href=\"#\" class=\"padding-5\"> \n" +
    "    <div class=\"media\">\n" +
    "      <div class=\"media-left\">\n" +
    "        <span class=\"avatar avatar-online\">\n" +
    "          <img src=\"assets/images/avatar-1-small.jpg\" alt=\"\">\n" +
    "        </span>\n" +
    "      </div>\n" +
    "      <div class=\"media-body\">\n" +
    "        <h5 class=\"list-group-item-heading\">\n" +
    "          <span ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"></span>\n" +
    "        </h5>\n" +
    "        <p class=\"list-group-item-text ng-binding\">State of champions</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </a>\n" +
    "</script>\n" +
    "\n" +
    "<div class=\"page-header padding-left-40 padding-top-10 padding-bottom-0 \">\n" +
    "  <h1 class=\"page-title\"><i class=\"icon fa-users\" aria-hidden=\"true\"></i>Users</h1>&nbsp;&nbsp;&nbsp;<button type=\"button\" class=\"btn btn-raised btn-info  btn-sm\">Students <span class=\"badge\">10</span> </button>&nbsp;&nbsp;&nbsp;<button type=\"button\" class=\"btn btn-raised btn-info  btn-sm\">Teachers <span class=\"badge\">2</span> </button>&nbsp;&nbsp;&nbsp;<button type=\"button\" class=\"btn btn-raised btn-info  btn-sm\">Parents <span class=\"badge\">10</span> </button>&nbsp;&nbsp;&nbsp;<button type=\"button\" class=\"btn btn-raised btn-info  btn-sm\">Admins <span class=\"badge\">2</span> </button>\n" +
    "  <div class=\"page-header-actions\">\n" +
    "    <button type=\"button\" class=\"btn btn-raised  btn-default btn-sm\" ng-click=\"add('teacher')\" ><i class=\"icon fa-plus\" aria-hidden=\"true\" ></i>Add</button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"row margin-10\">\n" +
    "  <div class=\"col-md-12 col-xs-12\">\n" +
    "    <div class=\"panel\"  >\n" +
    "\n" +
    "      <div class=\"panel-body padding-10\" >\n" +
    "        \n" +
    "        <div class=\"row\">\n" +
    "          <div class=\"col-md-4 text-left\">     \n" +
    "           <input type=\"text\" ng-model=\"customSelected\" placeholder=\"Add user to class \" uib-typeahead=\"user as user.name for user in vm.schoolusers  | filter:{name:$viewValue} | limitTo:8\" typeahead-template-url=\"customTemplate.html\" class=\"form-control\" typeahead-show-hint=\"true\"  typeahead-on-select=\"itemSelected($item, $model, $label, $event);customSelected=''\" typeahead-min-length=\"2\" typeahead-wait-ms=\"100\" width=\"200px\" />\n" +
    "          </div>  \n" +
    "        </div>\n" +
    "\n" +
    "        <ul class=\"list-group list-group-full\">\n" +
    "          <li class=\"list-group-item padding-10\"  ng-repeat=\"user in vm.users | filter:search\" ng-cloak>\n" +
    "            <div class=\"media\">\n" +
    "              <div class=\"media-left\">\n" +
    "                <span class=\"avatar avatar-online\">\n" +
    "                  <img src=\"assets/images/avatar-1-small.jpg\" alt=\"\">\n" +
    "                </span>\n" +
    "              </div>\n" +
    "              <div class=\"media-body\">\n" +
    "                <h5 class=\"list-group-item-heading\">\n" +
    "                  <span class=\"pull-right\">\n" +
    "                    <a class=\"text-action\" href=\"#\"><i class=\"icon wb-pencil\" aria-hidden=\"true\" ng-click=\"edit(user)\" ></i></a>\n" +
    "                    <a class=\"text-action\" href=\"#\"><i class=\"icon fa-remove\" aria-hidden=\"true\" ng-click=\"delete(user)\" ></i></a>\n" +
    "                    <a class=\"text-action\" href=\"#\"><i class=\"icon wb-payment\" aria-hidden=\"true\"></i></a>\n" +
    "                  </span>\n" +
    "                  {{user.lastname + ' ' + user.firstname}} &nbsp;&nbsp;&nbsp;&nbsp;<span class=\"label label-info\">{{user.type}} </span></a> \n" +
    "                </h5>\n" +
    "                <p class=\"list-group-item-text\">{{user.email}}</p>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "\n" +
    "\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("shared/app.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/app.tpl.html",
    "<div class=\"dashboard\" style=\"height: 100%\">\n" +
    "    <nav class=\"site-navbar navbar navbar-default navbar-fixed-top navbar-mega navbar-inverse\"\n" +
    "    role=\"navigation\" ng-cloak>\n" +
    "      <div class=\"navbar-header\">\n" +
    "\n" +
    "        <button type=\"button\" class=\"navbar-toggle collapsed\" id=\"sidemenu-toggle\" style=\"float: left;\">\n" +
    "          <i class=\"icon hamburger hamburger-arrow-left\">\n" +
    "            <span class=\"sr-only\">Toggle menubar</span>\n" +
    "            <span class=\"hamburger-bar\"></span>\n" +
    "          </i>\n" +
    "        </button>\n" +
    "\n" +
    "        <button type=\"button\" class=\"navbar-toggle collapsed\" data-target=\"#site-navbar-collapse\"\n" +
    "        data-toggle=\"collapse\" >\n" +
    "          <i class=\"icon wb-more-horizontal\" aria-hidden=\"true\"></i>\n" +
    "        </button>\n" +
    "        <a class=\"navbar-brand navbar-brand-center\" href=\"index.html\">\n" +
    "          <img class=\"navbar-brand-logo navbar-brand-logo-normal\" src=\"../assets/images/logo.png\"\n" +
    "          title=\"Remark\">\n" +
    "          <img class=\"navbar-brand-logo navbar-brand-logo-special\" src=\"../assets/images/logo-blue.png\"\n" +
    "          title=\"Remark\">\n" +
    "          <span class=\"navbar-brand-text hidden-xs\"> trainmoo</span>\n" +
    "        </a>\n" +
    "\n" +
    "      </div>\n" +
    "      <div class=\"navbar-container container-fluid\">\n" +
    "        <!-- Navbar Collapse -->\n" +
    "        <div class=\"collapse navbar-collapse navbar-collapse-toolbar\" id=\"site-navbar-collapse\">\n" +
    "          <!-- Navbar Toolbar -->\n" +
    "\n" +
    "          <!-- End Navbar Toolbar -->\n" +
    "          <!-- Navbar Toolbar Right -->\n" +
    "          <ul class=\"nav navbar-toolbar navbar-left navbar-toolbar-right\">\n" +
    "\n" +
    "            <li><a href=\"#\" ui-sref=\"app.apph.wall\"><i class=\"wb-icon wb-home\" aria-hidden=\"true\"></i>&nbsp; Home </a></li>\n" +
    "            <li><a  ui-sref=\"app.apph.apps.school\"><i class=\"wb-icon wb-settings active\" aria-hidden=\"true\"></i>&nbsp; School</a></li>\n" +
    "            <li><a  ui-sref=\"app.apph.events\"><i class=\"wb-icon wb-calendar\" aria-hidden=\"true\"></i>&nbsp;Calendar</a></li>\n" +
    "            <li><a href=\"#\"><i class=\"wb-icon wb-dashboard\" aria-hidden=\"true\"></i>&nbsp;Dashboard</a></li>\n" +
    "\n" +
    "          </ul>\n" +
    "\n" +
    "          <ul class=\"nav navbar-toolbar navbar-right navbar-toolbar-right\">\n" +
    "\n" +
    "            <li><a href=\"#\">Rambabu Ravuri, Teacher at Rauzr</a></li>\n" +
    "\n" +
    "            <li class=\"dropdown\">\n" +
    "              <a class=\"navbar-avatar dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\" aria-expanded=\"false\"\n" +
    "              data-animation=\"scale-up\" role=\"button\">\n" +
    "                <span class=\"avatar avatar-online\">\n" +
    "                  <img src=\"assets/images/avatar-1-small.jpg\" alt=\"...\">\n" +
    "                </span>\n" +
    "              </a>\n" +
    "              <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                <li role=\"presentation\">\n" +
    "                  <a ui-sref=\"app.appt.user\" role=\"menuitem\"><i class=\"icon wb-user\" aria-hidden=\"true\"></i> Profile</a>\n" +
    "                </li>\n" +
    "                <li role=\"presentation\">\n" +
    "                  <a href=\"javascript:void(0)\" role=\"menuitem\"><i class=\"icon wb-payment\" aria-hidden=\"true\"></i> Billing</a>\n" +
    "                </li>\n" +
    "                <li role=\"presentation\">\n" +
    "                  <a href=\"javascript:void(0)\" role=\"menuitem\"><i class=\"icon wb-settings\" aria-hidden=\"true\"></i> Settings</a>\n" +
    "                </li>\n" +
    "                <li class=\"divider\" role=\"presentation\"></li>\n" +
    "                <li role=\"presentation\">\n" +
    "                  <a href=\"javascript:void(0)\" role=\"menuitem\"><i class=\"icon wb-power\" aria-hidden=\"true\"></i> Logout</a>\n" +
    "                </li>\n" +
    "              </ul>\n" +
    "            </li>\n" +
    "\n" +
    "            <li><a href=\"#\"><i class=\"wb-icon wb-calendar\" aria-hidden=\"true\"></i><span class=\"badge badge-warn up\">5</span></a></li>\n" +
    "\n" +
    "            <li class=\"dropdown\">\n" +
    "              <a data-toggle=\"dropdown\" href=\"javascript:void(0)\" title=\"Notifications\" aria-expanded=\"false\"\n" +
    "              data-animation=\"scale-up\" role=\"button\">\n" +
    "                <i class=\"icon wb-bell\" aria-hidden=\"true\"></i>\n" +
    "                <span class=\"badge badge-danger up\">5</span>\n" +
    "              </a>\n" +
    "              <ul class=\"dropdown-menu dropdown-menu-right dropdown-menu-media\" role=\"menu\">\n" +
    "                <li class=\"dropdown-menu-header\" role=\"presentation\">\n" +
    "                  <h5>NOTIFICATIONS</h5>\n" +
    "                  <span class=\"label label-round label-danger\">New 5</span>\n" +
    "                </li>\n" +
    "                <li class=\"list-group\" role=\"presentation\">\n" +
    "                  <div data-role=\"container\">\n" +
    "                    <div data-role=\"content\">\n" +
    "                      <a class=\"list-group-item\" href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                        <div class=\"media\">\n" +
    "                          <div class=\"media-left padding-right-10\">\n" +
    "                            <i class=\"icon wb-order bg-red-600 white icon-circle\" aria-hidden=\"true\"></i>\n" +
    "                          </div>\n" +
    "                          <div class=\"media-body\">\n" +
    "                            <h6 class=\"media-heading\">A new order has been placed</h6>\n" +
    "                            <time class=\"media-meta\" datetime=\"2016-06-12T20:50:48+08:00\">5 hours ago</time>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </a>\n" +
    "                      <a class=\"list-group-item\" href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                        <div class=\"media\">\n" +
    "                          <div class=\"media-left padding-right-10\">\n" +
    "                            <i class=\"icon wb-user bg-green-600 white icon-circle\" aria-hidden=\"true\"></i>\n" +
    "                          </div>\n" +
    "                          <div class=\"media-body\">\n" +
    "                            <h6 class=\"media-heading\">Completed the task</h6>\n" +
    "                            <time class=\"media-meta\" datetime=\"2016-06-11T18:29:20+08:00\">2 days ago</time>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </a>\n" +
    "                      <a class=\"list-group-item\" href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                        <div class=\"media\">\n" +
    "                          <div class=\"media-left padding-right-10\">\n" +
    "                            <i class=\"icon wb-settings bg-red-600 white icon-circle\" aria-hidden=\"true\"></i>\n" +
    "                          </div>\n" +
    "                          <div class=\"media-body\">\n" +
    "                            <h6 class=\"media-heading\">Settings updated</h6>\n" +
    "                            <time class=\"media-meta\" datetime=\"2016-06-11T14:05:00+08:00\">2 days ago</time>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </a>\n" +
    "                      <a class=\"list-group-item\" href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                        <div class=\"media\">\n" +
    "                          <div class=\"media-left padding-right-10\">\n" +
    "                            <i class=\"icon wb-calendar bg-blue-600 white icon-circle\" aria-hidden=\"true\"></i>\n" +
    "                          </div>\n" +
    "                          <div class=\"media-body\">\n" +
    "                            <h6 class=\"media-heading\">Event started</h6>\n" +
    "                            <time class=\"media-meta\" datetime=\"2016-06-10T13:50:18+08:00\">3 days ago</time>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </a>\n" +
    "                      <a class=\"list-group-item\" href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                        <div class=\"media\">\n" +
    "                          <div class=\"media-left padding-right-10\">\n" +
    "                            <i class=\"icon wb-chat bg-orange-600 white icon-circle\" aria-hidden=\"true\"></i>\n" +
    "                          </div>\n" +
    "                          <div class=\"media-body\">\n" +
    "                            <h6 class=\"media-heading\">Message received</h6>\n" +
    "                            <time class=\"media-meta\" datetime=\"2016-06-10T12:34:48+08:00\">3 days ago</time>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </a>\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </li>\n" +
    "                <li class=\"dropdown-menu-footer\" role=\"presentation\">\n" +
    "                  <a class=\"dropdown-menu-footer-btn\" href=\"javascript:void(0)\" role=\"button\">\n" +
    "                    <i class=\"icon wb-settings\" aria-hidden=\"true\"></i>\n" +
    "                  </a>\n" +
    "                  <a href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                      All notifications\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "              </ul>\n" +
    "            </li>\n" +
    "            <li class=\"dropdown\">\n" +
    "              <a data-toggle=\"dropdown\" href=\"javascript:void(0)\" title=\"Messages\" aria-expanded=\"false\"\n" +
    "              data-animation=\"scale-up\" role=\"button\">\n" +
    "                <i class=\"icon wb-envelope\" aria-hidden=\"true\"></i>\n" +
    "                <span class=\"badge badge-info up\">3</span>\n" +
    "              </a>\n" +
    "              <ul class=\"dropdown-menu dropdown-menu-right dropdown-menu-media\" role=\"menu\">\n" +
    "                <li class=\"dropdown-menu-header\" role=\"presentation\">\n" +
    "                  <h5>MESSAGES</h5>\n" +
    "                  <span class=\"label label-round label-info\">New 3</span>\n" +
    "                </li>\n" +
    "                <li class=\"list-group\" role=\"presentation\">\n" +
    "                  <div data-role=\"container\">\n" +
    "                    <div data-role=\"content\">\n" +
    "                      <a class=\"list-group-item\" href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                        <div class=\"media\">\n" +
    "                          <div class=\"media-left padding-right-10\">\n" +
    "                            <span class=\"avatar avatar-sm avatar-online\">\n" +
    "                              <img src=\"../../global/portraits/2.jpg\" alt=\"...\" />\n" +
    "                              <i></i>\n" +
    "                            </span>\n" +
    "                          </div>\n" +
    "                          <div class=\"media-body\">\n" +
    "                            <h6 class=\"media-heading\">Mary Adams</h6>\n" +
    "                            <div class=\"media-meta\">\n" +
    "                              <time datetime=\"2016-06-17T20:22:05+08:00\">30 minutes ago</time>\n" +
    "                            </div>\n" +
    "                            <div class=\"media-detail\">Anyways, i would like just do it</div>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </a>\n" +
    "                      <a class=\"list-group-item\" href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                        <div class=\"media\">\n" +
    "                          <div class=\"media-left padding-right-10\">\n" +
    "                            <span class=\"avatar avatar-sm avatar-off\">\n" +
    "                              <img src=\"../../global/portraits/3.jpg\" alt=\"...\" />\n" +
    "                              <i></i>\n" +
    "                            </span>\n" +
    "                          </div>\n" +
    "                          <div class=\"media-body\">\n" +
    "                            <h6 class=\"media-heading\">Caleb Richards</h6>\n" +
    "                            <div class=\"media-meta\">\n" +
    "                              <time datetime=\"2016-06-17T12:30:30+08:00\">12 hours ago</time>\n" +
    "                            </div>\n" +
    "                            <div class=\"media-detail\">I checheck the document. But there seems</div>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </a>\n" +
    "                      <a class=\"list-group-item\" href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                        <div class=\"media\">\n" +
    "                          <div class=\"media-left padding-right-10\">\n" +
    "                            <span class=\"avatar avatar-sm avatar-busy\">\n" +
    "                              <img src=\"../../global/portraits/4.jpg\" alt=\"...\" />\n" +
    "                              <i></i>\n" +
    "                            </span>\n" +
    "                          </div>\n" +
    "                          <div class=\"media-body\">\n" +
    "                            <h6 class=\"media-heading\">June Lane</h6>\n" +
    "                            <div class=\"media-meta\">\n" +
    "                              <time datetime=\"2016-06-16T18:38:40+08:00\">2 days ago</time>\n" +
    "                            </div>\n" +
    "                            <div class=\"media-detail\">Lorem ipsum Id consectetur et minim</div>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </a>\n" +
    "                      <a class=\"list-group-item\" href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                        <div class=\"media\">\n" +
    "                          <div class=\"media-left padding-right-10\">\n" +
    "                            <span class=\"avatar avatar-sm avatar-away\">\n" +
    "                              <img src=\"../../global/portraits/5.jpg\" alt=\"...\" />\n" +
    "                              <i></i>\n" +
    "                            </span>\n" +
    "                          </div>\n" +
    "                          <div class=\"media-body\">\n" +
    "                            <h6 class=\"media-heading\">Edward Fletcher</h6>\n" +
    "                            <div class=\"media-meta\">\n" +
    "                              <time datetime=\"2016-06-15T20:34:48+08:00\">3 days ago</time>\n" +
    "                            </div>\n" +
    "                            <div class=\"media-detail\">Dolor et irure cupidatat commodo nostrud nostrud.</div>\n" +
    "                          </div>\n" +
    "                        </div>\n" +
    "                      </a>\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </li>\n" +
    "                <li class=\"dropdown-menu-footer\" role=\"presentation\">\n" +
    "                  <a class=\"dropdown-menu-footer-btn\" href=\"javascript:void(0)\" role=\"button\">\n" +
    "                    <i class=\"icon wb-settings\" aria-hidden=\"true\"></i>\n" +
    "                  </a>\n" +
    "                  <a href=\"javascript:void(0)\" role=\"menuitem\">\n" +
    "                      See all messages\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "              </ul>\n" +
    "            </li>\n" +
    "\n" +
    "          </ul>\n" +
    "\n" +
    "\n" +
    "          <!-- End Navbar Toolbar Right -->\n" +
    "        </div>\n" +
    "        <!-- End Navbar Collapse -->\n" +
    "        <!-- Site Navbar Seach -->\n" +
    "        <div class=\"collapse navbar-search-overlap\" id=\"site-navbar-search\">\n" +
    "          <form role=\"search\">\n" +
    "            <div class=\"form-group\">\n" +
    "              <div class=\"input-search\">\n" +
    "                <i class=\"input-search-icon wb-search\" aria-hidden=\"true\"></i>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"site-search\" placeholder=\"Search...\">\n" +
    "                <button type=\"button\" class=\"input-search-close icon wb-close\" data-target=\"#site-navbar-search\"\n" +
    "                data-toggle=\"collapse\" aria-label=\"Close\"></button>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </form>\n" +
    "        </div>\n" +
    "        <!-- End Site Navbar Seach -->\n" +
    "      </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div ui-view ng-cloak style=\"height: 100%\"></div>\n" +
    "\n" +
    "   <script type=\"text/javascript\">\n" +
    "      $(document).ready(function() {\n" +
    "          document.getElementById('fouc').style.display = 'block';\n" +
    "\n" +
    "          $(\"#sidemenu-toggle\").click(function(e) {\n" +
    "            console.log('clicked toggle');\n" +
    "            e.preventDefault();\n" +
    "            console.log($(\"#wrapper\"));\n" +
    "            $(\"#wrapper\").toggleClass(\"toggled\");\n" +
    "          });\n" +
    "      });\n" +
    "   </script>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("shared/apph.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/apph.tpl.html",
    "<div class=\"page\" >\n" +
    "	<div class=\"page-content padding-0\" >\n" +
    "	    <div ui-view ng-cloak ></div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("shared/apptop.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/apptop.tpl.html",
    "<div class=\"page\" >\n" +
    "	<div class=\"page-content padding-top-25 padding-left-5 padding-right-5 container-fluid  \">\n" +
    "	    <div ui-view ng-cloak></div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<footer class=\"site-footer\" ng-cloak>\n" +
    "	<div class=\"site-footer-legal\">© 2016 trainmoo</div>\n" +
    "	<div class=\"site-footer-right\">\n" +
    "	  Crafted by <a href=\"#\">Rauzr Inc</a>\n" +
    "	</div>\n" +
    "</footer>");
}]);

angular.module("shared/gallery.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/gallery.tpl.html",
    "<div ng-photoswipe slides=\"vm.slides\" open=\"vm.open\" slide-selector=\".slide-list > figure > a > img\"\n" +
    "      on-close=\"vm.closeGallery()\" options=\"vm.opts\"></div>\n" +
    "\n" +
    "<div class=\"form-group margin-0 padding-0\">\n" +
    "  <div ng-if=\"galleryTitle\">\n" +
    "    <label >{{galleryTitle}}</label><br>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- SHOW ALL FILES UPLOADED ALREDY-->\n" +
    "  <div  style=\"height: 120px; min-width: 80px; display: inline-block; margin: 10px; text-align: center; padding:0px;overflow: hidden;\" class=\"slide-list\" ng-repeat=\"picture in files\" >\n" +
    "\n" +
    "    <figure class=\"overlay \"> <!-- overlay-hover -->\n" +
    "      <a href=\"javascript:void(0)\" ng-click=\"vm.showGallery($index, picture)\">\n" +
    "        <img ng-src=\"api/img/download/thumbnail/{{picture.thumbnailid}}\" onerror=\"this.src='assets/images/default.png'\" style=\"max-height: 120px; width: auto;\" class=\"padding-0 overlay-figure\" />\n" +
    "      </a>\n" +
    "      <div class=\"top-right\" title=\"delete\" ><a ng-click=\"vm.deleteAttachment(files, picture)\" href=\"javascript:void(0)\" ng-if='!vm.readonly'> <i class=\"icon fa-trash-o \" aria-hidden=\"true\"></i></a> </div>\n" +
    "      <div class=\"top-left\" title=\"edit\">\n" +
    "      </div>\n" +
    "\n" +
    "      <figcaption class=\"overlay-bottom overlay-panel overlay-background padding-0\">\n" +
    "        <h6 ng-if=\"picture.caption\" class=\"margin-5\" >{{picture.caption}}</h6>\n" +
    "        <a  href=\"javascript:void(0)\" uib-popover-template=\"'myPopoverTemplate.html'\" popover-trigger=\"'outsideClick'\" popover-placement='bottom' popover-append-to-body='true' ng-if='!vm.readonly'><i class=\"icon fa-edit\" aria-hidden=\"true\" ></i></a> \n" +
    "      </figcaption>\n" +
    "\n" +
    "      <script type=\"text/ng-template\" id=\"myPopoverTemplate.html\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <label>Enter Caption:</label>\n" +
    "            <input type=\"text\" id=\"popoverCaption\" ng-model=\"picture.caption\" class=\"form-control\" ng-change=\"vm.formController.$setDirty(true)\">\n" +
    "          </div>\n" +
    "      </script>\n" +
    "    </figure>\n" +
    "  </div>\n" +
    "  <!-- FLOW JS - show progress and upload box -->\n" +
    "  <div style=\"display: inline; padding: 0px; margin: 0px;\" flow-init flow-name=\"gallery.images\"\n" +
    "                                     flow-file-added=\"vm.onFileAdded($file)\" \n" +
    "                                     flow-files-submitted=\"vm.uploadAttachment($file, $message, $flow)\"\n" +
    "                                     flow-file-success=\"vm.fileSuccess( $file, $message, $flow )\"\n" +
    "                                     flow-file-error=\"vm.fileError( $file, $message, $flow )\"\n" +
    "                                     flow-complete=\"vm.flowComplete($flow, 'gallery')\" ng-cloak \n" +
    "                                     ng-if=\"!vm.readonly && ( !single || single === 'false' || (single && single==='true' && files.length <= 0) )\">\n" +
    "    \n" +
    "    <!-- SHOW ALL FILES THAT ARE UPLOADED IN CURRENT SESSION - REMOVE ONCE COMPLETE - AND SHOW IN THE ABOVE SECTION -->\n" +
    "    <!-- <div ng-repeat=\"file in $flow.files\" style=\"height: 180px; min-width: 80px; display: inline-block; margin: 10px; text-align: center; padding:0px;overflow: hidden; \" ng-cloak>\n" +
    "      <figure class=\"overlay \">\n" +
    "        <img flow-img=\"file\" style=\"max-height: 180px; width: auto;\" class=\"padding-0 overlay-figure\" >\n" +
    "        <figcaption class=\"overlay-bottom overlay-panel overlay-background\">\n" +
    "          <div class=\"progress progress-lg\">\n" +
    "            <div class=\"progress-bar\" role=\"progressbar\"\n" +
    "                 aria-valuenow=\"{{file.progress() * 100}}\"\n" +
    "                 aria-valuemin=\"0\"\n" +
    "                 aria-valuemax=\"100\"\n" +
    "                 ng-style=\"{width: (file.progress() * 100) + '%'}\">\n" +
    "              {{file.progress() * 100}}%\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </figcaption>\n" +
    "      </figure>\n" +
    "\n" +
    "    </div> -->\n" +
    "\n" +
    "    <!-- BOX TO UPLOAD FILES -->\n" +
    "    <div class=\"drop\" style=\"height: 120px; width: 180px; display: inline-block; margin: 10px; text-align: center; overflow: hidden;\" ng-if=\"size === 'lg'\">\n" +
    "          <button type=\"button\" class=\"btn btn-icon btn-primary btn-outline\" style=\"position: relative; top: calc(50% - 30px);\" flow-btn><i class=\"icon fa-plus\" aria-hidden=\"true\"></i></button><br>\n" +
    "          <label style=\"position: relative;top: calc(50% - 10px)\">Add files</label>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"drop padding-10\" flow-drop style=\"height: 60px\" ng-if=\"size === 'sm'\">\n" +
    "        <span class=\"btn btn-sm btn-round btn-primary btn-outline\" flow-btn>Upload Avatar</span>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("shared/gmap.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("shared/gmap.tpl.html",
    "<input id=\"pac-input\" class=\"controls\" type=\"text\" placeholder=\"Search\" ng-model=\"address\">\n" +
    "<div id=\"locateMeDiv\">\n" +
    "  <div id=\"locateText\">Current Location&nbsp;&nbsp;<i class=\"icon fa-location-arrow\" aria-hidden=\"true\"></i></div>\n" +
    "</div>\n" +
    "<div class=\"gmapview height-300\"></div>\n" +
    "");
}]);

angular.module("user/directive/userCard.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("user/directive/userCard.tpl.html",
    "<div class=\"widget widget-shadow text-center margin-bottom-10\">\n" +
    "	<div class=\"widget-header padding-top-10 padding-bottom-0 padding-left-10 padding-right-10\">\n" +
    "		<div class=\"widget-actions\">\n" +
    "			<a class=\"text-action\" href=\"javascript:void(0)\"><i class=\"icon wb-edit\" aria-hidden=\"true\"></i></a>\n" +
    "				              </div>\n" +
    "	  <div class=\"widget-header-content\">\n" +
    "	    <a class=\"avatar avatar-lg\" href=\"/app/user/{{formData._id}}\">\n" +
    "	      <img ng-src=\"/api/img/download/{{formData.picture.fileid }}\" alt=\"...\">\n" +
    "	    </a>\n" +
    "	    <h4 class=\"profile-user\"><a href=\"/app/user/{{formData._id}}\">{{(formData.credential.name.firstname + \" \" + formData.credential.name.lastname) | capitalize}}</a></h4>\n" +
    "	    <p class=\"profile-job\">{{formData.title}}</p>\n" +
    "	    <strong>{{formData.summary}}</strong>\n" +
    "	    <p  style=\"line-height:175%\"> \n" +
    "		    {{(formData.address + ', ' + formData.city) | capitalize}}<br>\n" +
    "		    Certified in <span class=\"text-azure\">{{formData.certificationsDisplay}}</span><br>\n" +
    "		    Specialized in <span class=\"text-azure\">{{formData.specializationsDisplay}}</span><br>\n" +
    "		    Available for <span class=\"text-azure\">{{formData.trainingStyleDisplay}} training</span><br> \n" +
    "		    <span class=\"text-azure\">{{formData.experience}}</span> years experience<br>\n" +
    "		    <uib-rating ng-model=\"rate\" max=\"max\" read-only=\"isReadonly\"></uib-rating></p>\n" +
    "	    <div class=\"profile-social\">\n" +
    "	      <a class=\"icon bd-twitter\" href=\"javascript:void(0)\"></a>\n" +
    "	      <a class=\"icon bd-facebook\" href=\"javascript:void(0)\"></a>\n" +
    "	      <a class=\"icon bd-youtube\" href=\"javascript:void(0)\"></a>\n" +
    "	      <a class=\"icon bd-instagram\" href=\"javascript:void(0)\"></a>\n" +
    "	    </div>\n" +
    "	  </div>\n" +
    "	</div>\n" +
    "	<div class=\"widget-footer\">\n" +
    "	  <div class=\"row no-space\">\n" +
    "	    <div class=\"col-xs-4\">\n" +
    "	      <strong class=\"profile-stat-count\">1</strong>\n" +
    "	      <span>Classes</span>\n" +
    "	    </div>\n" +
    "	    <div class=\"col-xs-4\">\n" +
    "	      <strong class=\"profile-stat-count\">6</strong>\n" +
    "	      <span>Events</span>\n" +
    "	    </div>\n" +
    "	    <div class=\"col-xs-4\">\n" +
    "	      <strong class=\"profile-stat-count\">20</strong>\n" +
    "	      <span>Posts</span>\n" +
    "	    </div>\n" +
    "	  </div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("user/userEdit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("user/userEdit.tpl.html",
    "<div class=\"page-header  padding-left-20 padding-top-10 padding-bottom-0 \">\n" +
    "  <h1 class=\"page-title\">User Profile</h1>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div class=\"panel margin-20\">\n" +
    "	<div class=\"panel-body\" ng-controller=\"userController\" ng-cloak>\n" +
    "		<div class=\"row\">\n" +
    "			<div class=\"col-md-12\">\n" +
    "				<div id=\"panel_edit_account\" >\n" +
    "	                <form name=\"Form\" id=\"form\" novalidate ng-submit=\"form.submit(Form)\" >\n" +
    "							<fieldset>\n" +
    "								<h4>Account Information</h4>\n" +
    "								<div class=\"row padding-top-10\">\n" +
    "									<div class=\"col-md-5\">\n" +
    "										<div class=\"form-group \" ng-class=\"{'has-error':Form.firstname.$dirty && Form.firstname.$invalid, 'has-success':Form.firstname.$valid}\" >\n" +
    "											<label class=\"control-label\"> First Name  <span class=\"symbol required\"></label>\n" +
    "											<input type=\"text\" class=\"form-control\" id=\"firstname\" name=\"firstname\" ng-model=\"formData.name.firstname\" required>\n" +
    "											<span class=\"error text-small block\" ng-if=\"Form.firstname.$dirty && Form.firstname.$error.required\">Firstname is required.</span>\n" +
    "										</div>\n" +
    "										<div class=\"form-group \" ng-class=\"{'has-error':Form.lastname.$dirty && Form.lastname.$invalid, 'has-success':Form.lastname.$valid}\">\n" +
    "											<label class=\"control-label\"> Last Name  <span class=\"symbol required\"></label>\n" +
    "											<input type=\"text\" class=\"form-control underline\" id=\"lastname\" name=\"lastname\"  ng-model=\"formData.name.lastname\" required>\n" +
    "											<span class=\"error text-small block\" ng-if=\"Form.lastname.$dirty && Form.lastname.$error.required\">Lastname is required.</span>\n" +
    "										</div>\n" +
    "										<div class=\"form-group \" ng-class=\"{'has-error':Form.phone.$dirty && Form.phone.$invalid, 'has-success':Form.phone.$valid}\">\n" +
    "											<label class=\"control-label\"> Phone  <span class=\"symbol required\"></label>\n" +
    "	                                        <input type=\"text\" class=\"form-control\" id=\"phone\" name=\"phone\"  ui-mask=\"(999) 999-9999\"  ng-model=\"formData.phone\" required>\n" +
    "	                                        <span class=\"hint\">(999) 999-9999</span>\n" +
    "							                <span class=\"error text-small block\" ng-if=\"Form.phone.$dirty && Form.phone.$error.required\">Phone number is required.</span>\n" +
    "										</div>\n" +
    "\n" +
    "\n" +
    "										<div class=\"form-group \" ng-class=\"{'has-error':Form.email.$dirty && Form.email.$invalid, 'has-success':Form.email.$valid}\">\n" +
    "	                                        <label class=\"control-label\"> Email <span class=\"symbol required\"></span> </label>\n" +
    "	                                        <input type=\"email\" class=\"form-control underline\" name=\"email\" ng-model=\"formData.local.email\" required>\n" +
    "	                                        <span class=\"error text-small block\" ng-if=\"Form.email.$dirty && Form.email.$error.required\">Email is required.</span>\n" +
    "	                                        <span class=\"error text-small block\" ng-if=\"Form.email.$error.email\">Please, enter a valid email address.</span>\n" +
    "	                               	    </div>\n" +
    "\n" +
    "	                               	    <div class=\"form-group \">\n" +
    "							              <label class=\"pull-left\">I am a &nbsp;</label>\n" +
    "							              <div class=\"radio-custom radio-success inline small\" ng-repeat=\"userType in userTypes\" >\n" +
    "							                <input type=\"radio\" ng-model=\"formData.userType\" ng-value=\"userType\" id=\"{{userType}}\" checked=\"false\" />\n" +
    "							                <label for=\"{{userType}}\">{{userType}}</label>\n" +
    "							              </div>\n" +
    "							            </div>\n" +
    "\n" +
    "									</div>\n" +
    "									<div class=\"col-md-offset-1 col-md-5\">\n" +
    "										<div class=\"form-group \"  ng-class=\"{'has-error':Form.gender.$dirty && Form.gender.$invalid, 'has-success':Form.gender.$valid}\">\n" +
    "											<label class=\"control-label\"> Gender  <span class=\"symbol required\"></label>\n" +
    "											<div class=\"clip-radio radio-primary\">\n" +
    "												<input type=\"radio\" value=\"female\" name=\"gender\" id=\"us-female\"  ng-model=\"formData.gender\" required>\n" +
    "												<label for=\"us-female\"> Female </label>\n" +
    "												<input type=\"radio\" value=\"male\" name=\"gender\" id=\"us-male\"  ng-model=\"formData.gender\" required>\n" +
    "												<label for=\"us-male\"> Male </label>\n" +
    "											</div>\n" +
    "											<span class=\"error text-small block\" ng-if=\"Form.gender.$dirty && Form.gender.$error.required\">Gender is required.</span>\n" +
    "										</div>\n" +
    "										<div class=\"form-group \" ng-class=\"{'has-error':Form.address.$dirty && Form.address.$invalid, 'has-success':Form.address.$valid}\">\n" +
    "	                                        <label class=\"control-label\"> Location <span class=\"symbol required\"></span> </label>\n" +
    "	                                        <input type=\"text\" class=\"form-control underline\" name=\"address\" ng-model=\"formData.address\" required >\n" +
    "	                                        <span class=\"error text-small block\" ng-if=\"Form.address.$dirty && Form.address.$error.required\">Location is required.</span>\n" +
    "	                                        <span class=\"error text-small block\" ng-if=\"Form.address.$error.email\">Please, enter a valid address.</span>\n" +
    "	                               	    </div>\n" +
    "										<div class=\"row\" >\n" +
    "											<div class=\"col-md-4\">\n" +
    "												<div class=\"form-group \" ng-class=\"{'has-error':Form.zipcode.$dirty && Form.zipcode.$invalid, 'has-success':Form.zipcode.$valid}\">\n" +
    "													<label class=\"control-label\"> Zip Code  <span class=\"symbol required\"></label>\n" +
    "													<input class=\"form-control underline\" type=\"number\" name=\"zipcode\" id=\"zipcode\"  ng-model=\"formData.zipcode\" required>\n" +
    "													<span class=\"error text-small block\" ng-if=\"Form.zipcode.$dirty && Form.zipcode.$error.required\">Zipcode is required.</span>\n" +
    "												</div>\n" +
    "											</div>\n" +
    "											<div class=\"col-md-8\" >\n" +
    "												<div class=\"form-group \" ng-class=\"{'has-error':Form.city.$dirty && Form.city.$invalid, 'has-success':Form.city.$valid}\">\n" +
    "													<label class=\"control-label\"> City  <span class=\"symbol required\"></label>\n" +
    "													<input class=\"form-control underline tooltips\" type=\"text\" data-original-title=\"We'll display it when you write reviews\" data-rel=\"tooltip\"  title=\"\" data-placement=\"top\" name=\"city\" id=\"city\"  ng-model=\"formData.city\" required>\n" +
    "													<span class=\"error text-small block\" ng-if=\"Form.city.$dirty && Form.city.$error.required\">City is required.</span>\n" +
    "												</div>\n" +
    "											</div>\n" +
    "										</div>\n" +
    "\n" +
    "										<div class=\"form-group\">\n" +
    "											<label>My avatar {{formData.picture.fileid}}</label>\n" +
    "											<div class=\"row\">\n" +
    "												<div class=\"col-md-3 col-sm-1\">\n" +
    "													<div class=\"user-image\">\n" +
    "				                                        <div class=\"thumbnail\" ng-if=\"formData.picture\">\n" +
    "				                                            <img ng-src=\"/api/img/download/{{formData.picture.fileid}}\">\n" +
    "\n" +
    "				                                            <div class=\"user-image-buttons\" >\n" +
    "				                                                <span class=\"btn btn-danger btn-xs\" ng-click=\"deleteAvatar()\"> <i class=\"fa fa-times\"></i> </span>\n" +
    "				                                            </div>\n" +
    "				                                        </div>\n" +
    "			                                        </div>\n" +
    "		                                        </div>\n" +
    "	                                        </div>\n" +
    "\n" +
    "											<div flow-init flow-name=\"obj.flowImages\"\n" +
    "	                                             flow-file-added=\"!!{png:1,gif:1,jpg:1,jpeg:1}[$file.getExtension()]\"\n" +
    "	                                             flow-file-success=\"fileSuccess( $file, $message, $flow )\"\n" +
    "	                                             flow-file-error=\"fileError( $file, $message, $flow )\"\n" +
    "	                                             ng-if=\"!formData.picture\">\n" +
    "						                        <div class=\"drop padding-10\" flow-drop ng-if=\"!$flow.files.length\">\n" +
    "						                            <span class=\"btn btn-sm btn-round btn-info\" flow-btn>Upload Image</span>\n" +
    "						                        </div>\n" +
    "						                        <div class=\"row\">\n" +
    "\n" +
    "						                                <div class=\"col-md-3 col-sm-1\">\n" +
    "\n" +
    "						                                    <div class=\"user-image no-padding\"  class=\"alert\" flow-drop flow-drag-enter=\"style={border:'4px solid green'}\" flow-drag-leave=\"style={}\"\n" +
    "						                ng-style=\"style\">\n" +
    "						                                        <div class=\"thumbnail\" ng-if=\"$flow.files.length\">\n" +
    "						                                            <img flow-img=\"$flow.files[0]\">\n" +
    "\n" +
    "\n" +
    "						                                            <div class=\"user-image-buttons\" >\n" +
    "						                                                <span class=\"btn btn-danger btn-xs\" ng-click=\"$flow.cancel()\"> <i class=\"fa fa-times\"></i> </span>\n" +
    "						                                            </div>\n" +
    "						                                        </div>\n" +
    "						                                    </div>\n" +
    "						                                </div>\n" +
    "						                        </div>\n" +
    "					                   		 </div>\n" +
    "				                      </div>\n" +
    "									</div>\n" +
    "								</div>\n" +
    "							</fieldset>\n" +
    "\n" +
    "							<fieldset>\n" +
    "								<h4>\n" +
    "									Professional Information\n" +
    "								</h4>\n" +
    "\n" +
    "\n" +
    "								<div class=\"row padding-top-10\">\n" +
    "										<div class=\"col-md-5\">\n" +
    "											<div class=\"form-group \" ng-class=\"{'has-error':Form.title.$dirty && Form.title.$invalid, 'has-success':Form.title.$valid}\">\n" +
    "												<label class=\"control-label\"> Title <span class=\"symbol required\"></span> </label>\n" +
    "												<input type=\"text\"  class=\"form-control underline\"  class=\"form-control underline\" id=\"title\" name=\"title\"  ng-model=\"formData.title\" required>\n" +
    "												<span class=\"hint\">Profressional Title</span>\n" +
    "												<span class=\"error text-small block\" ng-if=\"Form.title.$dirty && Form.title.$error.required\">Title is required.</span>\n" +
    "											</div>\n" +
    "\n" +
    "											<div class=\"form-group \" ng-class=\"{'has-error':Form.experience.$dirty && Form.experience.$invalid, 'has-success':Form.experience.$valid}\">\n" +
    "												<label class=\"control-label\"> Experience <span class=\"symbol required\"></span> </label>\n" +
    "												<input type=\"number\" class=\"form-control underline\" id=\"experience\" name=\"experience\"  ng-model=\"formData.experience\" required>\n" +
    "												<span class=\"hint\">Experience in years</span>\n" +
    "												<span class=\"error text-small block\" ng-if=\"Form.experience.$dirty && Form.experience.$error.required\">Experience is required.</span>\n" +
    "											</div>\n" +
    "\n" +
    "											<div class=\"form-group \" ng-class=\"{'has-error':Form.current.$dirty && Form.current.$invalid, 'has-success':Form.current.$valid}\">\n" +
    "												<label class=\"control-label\"> Current <span class=\"symbol required\"></span> </label>\n" +
    "												<input type=\"text\" class=\"form-control underline\" id=\"current\" name=\"current\" ng-model=\"formData.current\" required>\n" +
    "												<span class=\"hint\">What is your current job?</span>\n" +
    "												<span class=\"error text-small block\" ng-if=\"Form.current.$dirty && Form.current.$error.required\">Current position is required.</span>\n" +
    "											</div>\n" +
    "										</div>\n" +
    "										<div class=\"col-md-offset-1 col-md-5\">\n" +
    "											<div class=\"select2-primary\">\n" +
    "												<div class=\"form-group \"  ng-class=\"{'has-error':Form.sepcialzations.$dirty && Form.sepcialzations.$invalid, 'has-success':Form.sepcialzations.$valid}\">\n" +
    "													<label for=\"sepcialzations\" class=\"control-label\">Specializations<span class=\"symbol required\"></span> </label>\n" +
    "													<select id=\"sepcialzations\" ui-select2 class=\"form-control underline\" multiple name=\"sepcialzations\" ng-model=\"formData.specializations\" required>\n" +
    "															<option>BodyBuilding</option>\n" +
    "															<option>Weight Loss</option>\n" +
    "															<option >Science</option>\n" +
    "															<option>Piano</option>\n" +
    "															<option>Photography</option>\n" +
    "															<option>CrossFit</option>\n" +
    "															<option>Mountain Climbing</option>\n" +
    "															<option>Cooking</option>\n" +
    "															<option>NodeJS</option>\n" +
    "													</select>\n" +
    "													<span class=\"error text-small block\" ng-if=\"Form.specializations.$dirty && Form.specializations.$error.required\">Please select specializations.</span>\n" +
    "												</div>\n" +
    "											</div>\n" +
    "\n" +
    "											<div class=\"select2-primary\">\n" +
    "\n" +
    "												<div class=\"form-group \" ng-class=\"{'has-error':Form.certifications.$dirty && Form.certifications.$invalid, 'has-success':Form.certifications.$valid}\">\n" +
    "													<label for=\"certifications\" class=\"control-label\">Certifications<span class=\"symbol required\"></span> </label>\n" +
    "													<select id=\"certifications\" ui-select2   class=\"form-control\" multiple name=\"certifications\"  ng-model=\"formData.certifications\" required>\n" +
    "															<option>ACS</option>\n" +
    "															<option>IFBB Pro</option>\n" +
    "															<option>MBBS</option>\n" +
    "															<option>Physio</option>\n" +
    "															<option>Photography</option>\n" +
    "															<option>CrossFit Level1</option>\n" +
    "															<option>Mountain Climbing</option>\n" +
    "															<option>SCJCP</option>\n" +
    "															<option>AWS Associate</option>\n" +
    "													</select>\n" +
    "													<span class=\"error text-small block\" ng-if=\"Form.certifications.$dirty && Form.certifications.$error.required\">Certifications is required.</span>\n" +
    "												</div>\n" +
    "											</div>\n" +
    "\n" +
    "											<div class=\"select2-primary\">\n" +
    "												<div class=\"form-group \" ng-class=\"{'has-error':Form.training.$dirty && Form.training.$invalid, 'has-success':Form.training.$valid}\">\n" +
    "													<label for=\"training\" class=\"control-label\">Training<span class=\"symbol required\"></span> </label>\n" +
    "													<select id=\"training\" ui-select2  class=\"form-control\" multiple  ng-model=\"formData.trainingStyle\" name=\"training\"required>\n" +
    "															<option>Online</option>\n" +
    "															<option>Personal</option>\n" +
    "															<option>In Class</option>\n" +
    "															<option>At Home</option>\n" +
    "															<option>One on One</option>\n" +
    "															<option>Group</option>\n" +
    "															<option>Corporate</option>\n" +
    "													</select>\n" +
    "													<span class=\"error text-small block\" ng-if=\"Form.training.$dirty && Form.training.$error.required\">Training is required.</span>\n" +
    "												</div>\n" +
    "											</div>\n" +
    "										</div>\n" +
    "								</div>\n" +
    "\n" +
    "								<div class=\"row\">\n" +
    "									<div class=\"col-md-6\">\n" +
    "										<div class=\"form-group \" ng-class=\"{'has-error':Form.summary.$dirty && Form.summary.$invalid, 'has-success':Form.summary.$valid}\">\n" +
    "											<label class=\"control-label\"> Summary <span class=\"symbol required\"></span> </label>\n" +
    "	                                   	    <textarea class=\"form-control autosize area-animated\" ng-model=\"formData.summary\" id=\"summary\" name=\"summary\" required></textarea>\n" +
    "	                                   	    <span class=\"hint\">Introduce your self</span>\n" +
    "	                                   	    <span class=\"error text-small block\" ng-if=\"Form.summary.$dirty && Form.summary.$error.required\">Summary is required.</span>\n" +
    "	                                	</div>\n" +
    "	                            	</div>\n" +
    "								</div>\n" +
    "							</fieldset>\n" +
    "\n" +
    "							<fieldset>\n" +
    "								<h4>\n" +
    "									Social Information\n" +
    "								</h4>\n" +
    "								<div class=\"row padding-top-10\">\n" +
    "									<div class=\"col-md-5\">\n" +
    "										<div class=\"form-group \">\n" +
    "											<label class=\"control-label\"> Twitter </label>\n" +
    "											<span class=\"input-icon\">\n" +
    "												<input class=\"form-control underline\" type=\"text\" ng-model=\"formData.social.twitter\">\n" +
    "												<i class=\"fa fa-twitter\"></i> </span>\n" +
    "										</div>\n" +
    "										<div class=\"form-group \">\n" +
    "											<label class=\"control-label\"> Facebook </label>\n" +
    "											<span class=\"input-icon\">\n" +
    "												<input class=\"form-control underline\" type=\"text\" ng-model=\"formData.social.facebook\">\n" +
    "												<i class=\"fa fa-facebook\"></i> </span>\n" +
    "										</div>\n" +
    "										<div class=\"form-group \">\n" +
    "											<label class=\"control-label\"> Youtube </label>\n" +
    "											<span class=\"input-icon\">\n" +
    "												<input class=\"form-control underline\" type=\"text\" ng-model=\"formData.social.youtube\">\n" +
    "												<i class=\"fa fa-youtube\"></i> </span>\n" +
    "										</div>\n" +
    "									</div>\n" +
    "									<div class=\"col-md-offset-1 col-md-5\">\n" +
    "										<div class=\"form-group \">\n" +
    "											<label class=\"control-label\"> Instragram </label>\n" +
    "											<span class=\"input-icon\">\n" +
    "												<input class=\"form-control underline\" type=\"text\" ng-model=\"formData.social.github\">\n" +
    "												<i class=\"fa fa-instagram\"></i> </span>\n" +
    "										</div>\n" +
    "										<div class=\"form-group \">\n" +
    "											<label class=\"control-label\"> Linkedin </label>\n" +
    "											<span class=\"input-icon\">\n" +
    "												<input class=\"form-control underline\" type=\"text\" ng-model=\"formData.social.linkedin\">\n" +
    "												<i class=\"fa fa-linkedin\"></i> </span>\n" +
    "										</div>\n" +
    "										<div class=\"form-group \">\n" +
    "											<label class=\"control-label\"> Skype </label>\n" +
    "											<span class=\"input-icon\">\n" +
    "												<input class=\"form-control underline\" type=\"text\" ng-model=\"formData.social.skype\">\n" +
    "												<i class=\"fa fa-skype\"></i> </span>\n" +
    "										</div>\n" +
    "									</div>\n" +
    "								</div>\n" +
    "							</fieldset>\n" +
    "							<div class=\"row\">\n" +
    "								<div class=\"col-md-12 \">\n" +
    "									<button class=\"btn btn-outline btn-primary btn-round pull-right\" type=\"submit\">\n" +
    "										Update <i class=\"fa fa-save\"></i>\n" +
    "									</button>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "					</form>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("userList/userList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("userList/userList.tpl.html",
    "<div class=\"page\">\n" +
    "    <div class=\"page-content\">\n" +
    "    	<div class=\"row\">\n" +
    "				<div class=\"col-xs-12 col-sm-12\">\n" +
    "					<div class=\"container-fluid\">\n" +
    "						<div class=\"panel panel-white\" >\n" +
    "							<div class=\"panel-body\">\n" +
    "								<div class=\"row border-bottom margin-top-10\" ng-repeat=\"user in ::userList | filter: search | orderBy: name.firstname\">\n" +
    "							  		<div class=\"col-sm-2\">\n" +
    "										<a href=\"#\">\n" +
    "											      <img class=\"media-object\" ng-src=\"/api/img/download/{{::user.picture.fileid}}\" alt=\"pic\" height=\"120\" width=\"120\">\n" +
    "											    </a>\n" +
    "							  		</div>52\n" +
    "							  		<div class=\"col-sm-10\">\n" +
    "							  			<a href=\"/app/user/{{user.id}}\" ng-click=\"getUser(user.id)\"><span class=\"text-extra-large\">{{::user.name}}</span></a>&nbsp;&nbsp;&nbsp;<b>{{::user.title}}</b>\n" +
    "							  		</div>\n" +
    "							  		<div class=\"col-sm-5\">\n" +
    "							 			<p  style=\"line-height:175%\"> Certified in <span class=\"text-azure\">{{::user.certifications}}</span><br>\n" +
    "									    Specialized in <span class=\"text-azure\">{{::user.specializations}}</span><br>\n" +
    "									    Available for <span class=\"text-azure\">{{::user.trainingStyle}} training</span><br> \n" +
    "									    <span class=\"text-azure\">{{::user.experience}}</span> years experience<br>\n" +
    "									    <uib-rating ng-model=\"rate\" max=\"max\" read-only=\"isReadonly\"></uib-rating></p>\n" +
    "								    </div>\n" +
    "								    <div class=\"col-sm-5\">\n" +
    "									      <p style=\"line-height:175%\"> <i class=\"fa fa-inr\"></i>&nbsp;<span class=\"text-azure\">{{::user.costPerSession}}</span> per session<br>\n" +
    "									       <i class=\"fa fa-thumbs-o-up\"></i>&nbsp;{{::user.feedbackPositive}}% positive feedback ({{::user.feedbackVotes}} votes)<br>\n" +
    "									       <i class=\"fa fa-bars\"></i>&nbsp;{{::user.activeSessions}} active sessions and {{::user.startingSoon}} starting in {{::user.startingInDays}} days<br>\n" +
    "									       <a href=\"app/classes/users/{{user.id}}\">My Classes</a> &nbsp;  <a href=\"app/wall/{{user.id}}\">Profile</a>\n" +
    "									       </p>\n" +
    "\n" +
    "								    	   <p><button class=\"btn btn-outline btn-primary btn-round\">Appointment</button> &nbsp; <button  class=\"btn btn-outline btn-primary btn-round\">Contact</button></p>\n" +
    "								    </div>\n" +
    "									</div>	\n" +
    "							</div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("wall/wall.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("wall/wall.tpl.html",
    "<style>\n" +
    "\n" +
    "  .icon-bar {\n" +
    "      width: 100%;\n" +
    "      text-align: center;\n" +
    "      background-color: white;\n" +
    "      overflow: auto;\n" +
    "      top: 0;\n" +
    "  }\n" +
    "\n" +
    "  .icon-bar a {\n" +
    "      width: 20%;\n" +
    "      padding: 12px 0;\n" +
    "      float: left;\n" +
    "      transition: all 0.3s ease;\n" +
    "      \n" +
    "      font-size: 14px;\n" +
    "  }\n" +
    "\n" +
    "  .icon-bar a:hover {\n" +
    "      background-color: #e4eaec;\n" +
    "  }\n" +
    "\n" +
    "\n" +
    "  .input[type=text] {\n" +
    "      width: 150px;\n" +
    "      box-sizing: border-box;\n" +
    "      border: 2px solid #ccc;\n" +
    "      border-radius: 4px;\n" +
    "      font-size: 16px;\n" +
    "      background-color: white;\n" +
    "      background-position: 10px 10px;\n" +
    "      background-repeat: no-repeat;\n" +
    "      padding: 12px 20px 12px 40px;\n" +
    "      -webkit-transition: width 0.4s ease-in-out;\n" +
    "      transition: width 0.4s ease-in-out;\n" +
    "  }\n" +
    "  \n" +
    "  .input[type=text]:focus {\n" +
    "      width: 100%;\n" +
    "  }\n" +
    "</style>\n" +
    "\n" +
    "\n" +
    "\n" +
    "  <script type=\"text/javascript\">\n" +
    "    $(\"#menu-toggle\").click(function(e) {\n" +
    "      e.preventDefault();\n" +
    "      $(\"#wrapper\").toggleClass(\"toggled\");\n" +
    "    });\n" +
    "  </script>\n" +
    "\n" +
    "<div class=\"row\" >\n" +
    "  <div id=\"wrapper\">\n" +
    "\n" +
    "    <wallnav />\n" +
    "\n" +
    "    <!-- Page Content -->\n" +
    "    <div id=\"page-content-wrapper\" style=\"padding-left: 5px; padding-right: 5px; padding-bottom: 0px; padding-top: 5px; \">\n" +
    "\n" +
    "        <div class=\"col-md-8\">\n" +
    "          <div class=\"row comments\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "              <post placeholder=\"Create new post..\"></post>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\"  ng-repeat=\"msg in posts\" >\n" +
    "              <div class=\"panel panel-white  margin-bottom-5\" ng-cloak>\n" +
    "                <div class=\"panel-body padding-10 \">\n" +
    "                    <comment msg=\"msg\" ></comment>\n" +
    "                </div>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>  \n" +
    "        <div class=\"col-md-4\">\n" +
    "          <div style=\"display: block;\">\n" +
    "            <div class=\"icon-bar\">\n" +
    "              <div style=\"display:inline-block; float:left;margin:8px;text-align:left;width: 50%\" >\n" +
    "\n" +
    "                <form> <input type=\"text\" class=\"form-control\" name=\"search\" placeholder=\"Search posts, files..\"> </form>\n" +
    "              </div>\n" +
    "               <a class=\"active\" href=\"#\"><i class=\"fa fa-bookmark\"></i></a>\n" +
    "               <a href=\"#\"><i class=\"fa fa-star\"></i></a>\n" +
    "            </div>\n" +
    "            <div style=\"margin-top: 10px\">\n" +
    "              <pre>There are no mentions and files.\n" +
    "              </pre>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  </div>");
}]);
